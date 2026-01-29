<?php
//message controller
namespace App\Http\Controllers;

use App\Events\MarkAsSeen;
use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;

use function Symfony\Component\Clock\now;

class MessageController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }
    public function markAsSeen(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'conversation_id' => 'required|exists:conversations,id',
        ]);

        Message::where('conversation_id', $request->conversation_id)
            ->where('sender_id', '!=', $user->id)
            ->whereNull('seen_at')
            ->update(['seen_at' => now()]);

        broadcast(new MarkAsSeen($request->conversation_id, $user->id));

        return response()->noContent();
    }


    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $msg = $request->validate([
            'conversation_id' => 'required',
            'message' => 'required|min:1|max:255',
        ]);
        $msg['sender_id'] = $request->user()->id;
        $message = Message::create($msg);
        $conversation = Conversation::where('id', $msg['conversation_id'])->first();
        $conversation->last_message_id = $message->id;
        $conversation->save();
        broadcast(new MessageSent($message));
        return response()->json('message sent');
    }

    /**
     * Display the specified resource.
     */
    public function show(Message $message) {}



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Message $message)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Message $message)
    {
        //
    }
}
