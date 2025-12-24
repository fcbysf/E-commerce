<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{

        
    
    public function index()
    {
        return User::with('orders')->latest()->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */


    /**
     * Display the specified resource.
     */
    public function show(User $user)
    {
        //
    }


    public function update(Request $request, User $user)
    {
        if($request->role){
            $user->update([
                'role' => $request->role
            ]);
            return response()->json([$request->role,$user->id]);
        }
    }


    public function destroy(User $user)
    {
        //
    }
}
