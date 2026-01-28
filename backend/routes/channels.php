<?php
use Illuminate\Support\Facades\Broadcast;

Broadcast::channel('chat.{conversationId}', function ($user, $conversationId) {
    return \App\Models\Conversation::where('id', $conversationId)
        ->where(fn($q) => $q->where('seller_id', $user->id)->orWhere('buyer_id', $user->id))
        ->exists();
});
