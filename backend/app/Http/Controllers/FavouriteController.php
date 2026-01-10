<?php

namespace App\Http\Controllers;

use App\Models\Favourite;
use Illuminate\Http\Request;

class FavouriteController extends Controller
{

    public function index()
    {
        return Favourite::with('product')->latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer',
            'user_id' => 'required|integer'
        ]);
        $favourite= Favourite::where('product_id', $request->product_id)->where('user_id', $request->user_id)->first();
        if($favourite){
            $favourite->delete();
            return response()->json('removed from fav');
        }
        Favourite::create([
            'product_id' => $request->product_id,
            'user_id' => $request->user_id
        ]);
        return response()->json('added');
    
    }
    public function destroy(Favourite $favourite)
    {
        $favourite->delete();
        return $favourite;
    }
}
