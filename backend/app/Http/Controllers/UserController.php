<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{

        
    
    public function index()
    {
        return User::with('orders')->latest()->paginate(10);
    }

    /**
     * Show the form for creating a new resource.
     */


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
        if($request->has('currentPassword')){
            $request->validate([
                'currentPassword' => 'required',
                'newPassword' => 'required|min:6|confirmed'
            ]);
            if(Hash::check($request->newPassword, $user->password)){
                return response()->json('same Password', 400);
            };
            if(password_verify($request->currentPassword, $user->password)){
                $user->update([
                    'password' => $request->newPassword
                ]);
                return response()->json('password updated', 200);
            }
            return response()->json('current password is wrong', 400);
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
