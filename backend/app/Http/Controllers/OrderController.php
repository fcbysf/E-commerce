<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;

class OrderController extends Controller
{

    public function index()
    {
        return Order::with('items.product', 'user')->latest()->get();
    }
    public function userOrders(Request $request)
    {
        return Order::with('items.product',)->where('user_id', $request->user()->id)->where('status', 'pending')->latest()->get();
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
        $order = Order::create($orderData);
        foreach ($request->cart as $cart) {
            OrderItem::create([
                'order_id' => $order->id,
                'product_id' => $cart->product['product']['id'],
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
        return $order->load('items.product', 'user');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Order $order)
    {
        $request->validate([
            'status' => 'required',
            'product' => 'required',
        ]);
        $order->status = $request->input('status');
        $order->save();
        foreach ($request->product as $product) {
            $prd = Product::where('id', $product['id'])->first();
            $prd->stock = $product['stock']-1;
            $prd->save();
        }
        return $order;
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Order $order)
    {
        $order->delete();
        return response()->json("order deleted");
    }
}
