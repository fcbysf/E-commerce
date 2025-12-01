<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $orderData = $request->validate([
            'total_price' => 'required',
            'address' => 'required|min:8',
            'phone' => 'required|min:8'
        ]);
        $orderData['user_id'] = $request->user()->id;
        $order=Order::create($orderData);
        foreach($request->cart as $cart) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $cart['product']['id'],
                'quantity' => $cart['quantity'],
                'unit_price' => $cart['product']['price']
            ]);
            Cart::destroy($cart['id']);
    }
    return response()->json("order done");
}

    /**
     * Display the specified resource.
     */
    public function show(Order $order)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        //
    }
}
