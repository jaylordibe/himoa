import { Injectable } from '@nestjs/common';
import Handlebars from 'handlebars';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createTransport } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly transport = createTransport({ url: process.env.SMTP_URL });

  render(template: string, data: Record<string, unknown>): { html: string; text: string } {
    const dir = join(__dirname, 'templates');
    const html = Handlebars.compile(readFileSync(join(dir, `${template}.hbs`), 'utf8'))(data);
    const text = Handlebars.compile(readFileSync(join(dir, `${template}.txt.hbs`), 'utf8'))(data);
    return { html, text };
  }

  async send(template: string, to: string, subject: string, data: Record<string, unknown>) {
    const { html, text } = this.render(template, data);
    await this.transport.sendMail({ from: process.env.MAIL_FROM, to, subject, html, text });
  }
}
