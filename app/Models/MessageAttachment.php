<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MessageAttachment extends Model
{
    //
    protected $fillable = [
        'name',
        'path',
        'mime',
        'size',
        'message_id',
    ];
}
