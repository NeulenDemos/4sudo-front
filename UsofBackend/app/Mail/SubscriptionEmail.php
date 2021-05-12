<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class SubscriptionEmail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * Create a new message instance.
     *
     * @return void
     */
    public function __construct($obj)
    {
        $this->obj = $obj;
    }

    /**
     * Build the message.
     *
     * @return $this
     */
    public function build()
    {
        return $this->from('nazar.3taran.id@gmail.com', 'USOF')
                    ->view('mails.subscription')
                    ->text('mails.subscription_plain')
                    ->with([
                        'login' => $this->obj->login,
                        'link' => $this->obj->link,
                        'user' => $this->obj->user,
                        'comment' => $this->obj->comment,
                        'title' => $this->obj->title
                    ]);
    }
}
