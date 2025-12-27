<?php

namespace App\Http\Controllers;

use App\Models\Favourite;
use Illuminate\Http\Request;

class FavouriteController extends Controller
{

    public function index()
    {
        return Favourite::latest()->get();
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|integer'
        ]);
        Favourite::create([
            'product_id' => $request->product_id
        ]);
        return 'added';
    }
    public function destroy(Favourite $favourite)
    {
        $favourite->delete();
        return $favourite;
    }
}
