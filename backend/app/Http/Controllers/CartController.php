<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use League\Config\Exception\ValidationException;

class CartController extends Controller
{
    public function index(Request $request)
    {
        $user_id = $request->user()->id;
        return Cart::with(['user','product'])->where('user_id', $user_id)->get();
    }

    public function store(Request $request)
    {
        try{
            $cartData = $request->validate([
                'user_id' => 'required',
                'product_id' => 'required',
                'quantity' => 'required'
            ]);
            $cart= Cart::create($cartData);
            return response()->json($cart->id);
        }
        catch(ValidationException $e){
            return response()->json($e->getMessage());
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Cart $cart)
    {
        return $cart->load('user');
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Cart $cart)
    {
        //
    }

    public function destroy(Cart $cart)
    {
        $cart->delete();
        return response()->json("cart deleted");
    }
}
