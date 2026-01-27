<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Message extends Model
{
    protected $fillable = [
        'conversation_id',
        'sender_id',
        'message',
        'seen_at',
        'file_path',
        'file_type'
    ];
    public function conversation(){
        return $this->belongsTo(Conversation::class);
    }
    public function sender(){
        return $this->belongsTo(User::class);
    }
    
}
