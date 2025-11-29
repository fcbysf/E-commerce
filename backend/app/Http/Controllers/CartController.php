<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;
use League\Config\Exception\ValidationException;

class CartController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user_id = $request->user()->id;
        return Cart::with('user')->where('user_id', $user_id)->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        try{
            $cartData = $request->validate([
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

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Cart $cart)
    {
        //
    }
}
