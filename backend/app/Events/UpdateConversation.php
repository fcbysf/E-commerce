<?php

namespace App\Events;

use App\Models\Conversation;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Contracts\Broadcasting\ShouldBroadcastNow;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class UpdateConversation implements ShouldBroadcastNow
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $conversation;
    /**
     * Create a new event instance.
     */
    public function __construct(Conversation $conversation)
    {
        $this->conversation = $conversation->load('seller:id,name,image', 'buyer:id,name,image', 'lastMessage:id,message,file_type,sender_id,seen_at,created_at', 'listing.images');
    }

    /**
     * Get the channels the event should broadcast on.
     *
     * @return array<int, \Illuminate\Broadcasting\Channel>
     */
    public function broadcastOn(): array
    {
        return [
            new PrivateChannel("conversations.{$this->conversation->seller_id}"),
            new PrivateChannel("conversations.{$this->conversation->buyer_id}"),        ];
    }
    public function broadcastAs()
    {
        return 'UpdateConversation';
    }
}
