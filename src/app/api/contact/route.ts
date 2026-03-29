import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const name = typeof body?.name === 'string' ? body.name.trim() : '';
        const method = typeof body?.method === 'string' ? body.method.trim() : '';
        const contactValue = typeof body?.contactValue === 'string' ? body.contactValue.trim() : '';
        const message = typeof body?.message === 'string' ? body.message.trim() : '';

        if (!method || !contactValue || !message) {
            return NextResponse.json({ error: 'Missing required fields.' }, { status: 400 });
        }

        const from = process.env.CONTACT_FROM_EMAIL;
        const to = process.env.CONTACT_TO_EMAIL;

        if (!from || !to) {
            return NextResponse.json({ error: 'Server misconfigured.' }, { status: 500 });
        }

        const subject = name ? `Portfolio message from ${name}` : 'New portfolio message';
        const text = [
            `Name: ${name || 'Not provided'}`,
            `Preferred contact: ${method} - ${contactValue}`,
            '',
            message,
        ].join('\n');

        await resend.emails.send({
            from,
            to,
            subject,
            text,
        });

        return NextResponse.json({ ok: true });
    } catch (error) {
        return NextResponse.json({ error: 'Failed to send message.' }, { status: 500 });
    }
}
