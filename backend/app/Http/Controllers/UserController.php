<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

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
        $infos= $request->validate([
            'name' =>'min:3',
            'email' => 'email',
            'phone' => 'numeric|nullable|digits_between:8,15',
            'adresse' => 'string|min:6|nullable',
            'image' => 'nullable|image|max:2048|sometimes',
            "removeImage" => 'sometimes|boolean'
        ]);
        if($request->hasFile('image')){
            $file = $request->file('image');
            $file->store('images', 'public');
            $infos['image'] =  url('storage/images/', $file->hashName());
        }
        if($request->input('removeImage')){
            $infos['image'] = null;
        }
        $user->update($infos);
        return response()->json('updated', 200);
    }


    public function destroy(User $user)
    {
        //
    }
}
