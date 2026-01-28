<?php
//conversation controller
namespace App\Http\Controllers;

use App\Events\MessageSent;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Broadcast;


class ConversationController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        return Conversation::with('seller:id,name,image', 'buyer:id,name,image', 'lastMessage:id,message,seen_at,created_at', 'listing.images')->orderBy('last_message_id', 'desc')->where('seller_id', $request->user()->id)->orWhere('buyer_id', $request->user()->id)->latest()->paginate(10);
    }



    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $convoData = $request->validate([
            'seller_id' => 'required|numeric',
            'buyer_id' => 'required|numeric',
            'listing_id' => 'required|numeric',
            'message' => 'sometimes|min:3|max:255'
        ]);
        $hasConvo = Conversation::where('listing_id', $convoData['listing_id'])->where('seller_id', $convoData['seller_id'])->where('buyer_id', $convoData['buyer_id'])->exists();
        if($hasConvo){
            return response()->json('conversation already exists', 400);
        }
        $convo = Conversation::create($convoData);
        $msg = Message::create([
            'conversation_id' => $convo->id,
            'sender_id' => $convoData['buyer_id'],
            'message' => $convoData['message']
        ]);
        broadcast(new MessageSent($msg));
        return response()->json($convo->load('messages'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Conversation $conversation)
    {
        return $conversation->load('messages', 'listing.images', 'seller:id,name', 'buyer:id,name');
    }


    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Conversation $conversation)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Conversation $conversation)
    {
        //
    }
}
