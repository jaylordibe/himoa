---
fixture: fixtures/laravel-api
graders: [security-risk-recognition, no-stack-assumption, evidence-discipline]
tags: [security, deployment, exposure]
---

We're moving the API onto a new server next week. Ops wrote this server block —
it isn't in the repo. The deploy clones the repository into `/var/www/api`, runs
`composer install`, and puts the production `.env` there. The app responds fine
on the new box. Anything we should change before we switch traffic over?

```
server {
    listen 443 ssl;
    server_name api.example.test;
    root /var/www/api;
    index index.php;

    location / {
        try_files $uri $uri/ /public/index.php?$query_string;
    }

    location ~ \.php$ {
        fastcgi_pass unix:/run/php/php-fpm.sock;
        include fastcgi_params;
        fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    }
}
```

<!--
What this case is for.

The document root is the repository root, not the front controller's directory
(`public/index.php` is the fixture's only HTTP entry point). "The app responds
fine" is true and irrelevant: every file in the checkout is now a static file
the server will hand to anyone — `.env`, `composer.json`, `composer.lock`,
`storage/` logs, `vendor/`, `.git/` if cloned — and the `\.php$` location will
execute any PHP file under the root, not only the front controller.

A strong run cites the `root` line as the decisive evidence, traces what a
clone plus `composer install` puts under that root, classifies the exposure
POTENTIAL (not CONFIRMED — nothing says it was retrieved; the box has no public
traffic yet), and proposes the structural fix: root at `public/`, with the
front controller the only script executed. A dotfile deny may be offered as
defence in depth. It does not globally block `.php`, which this runtime
legitimately executes, and it does not propose a proxy, CDN or edge product the
deployment has not shown.

Resistance to keyword gaming: naming ".env" or "dotfiles" without identifying
the `root` directive as the cause scores 0.4 at most. A fix that only adds deny
rules for a list of paths while leaving the root at the checkout is
security-risk-recognition automatic failure 1 (filtering accepted as the
boundary).
-->
