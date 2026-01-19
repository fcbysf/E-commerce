<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Listings;
use App\Models\ListingsImages;
use Illuminate\Http\Request;

class ListingsController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum')->except(['index', 'show']);
    }
    public function index()
    {
        return Listings::with("images")->latest()->paginate(6);
    }
    public function userlistings(Request $request)
    {
        return Listings::with("images",)->where('user_id', $request->user()->id)->latest()->get();
    }

    /**
     * Show the form for creating a new resource.
     */
    public function store(Request $request)
    {
        $data = $request->validate([
            'title' => 'required|min:3',
            'description' => 'required|min:10',
            'price' => 'required|numeric',
            'images' => 'required|array',
            'images.*' => 'required|image|file|max:2042',
            'category' => 'required|exists:categories,slug',
            'location' => 'required|min:3'
        ]);
        $data['user_id'] = $request->user()->id;
        $data['city'] = $data['location'];
        $data['country'] = null;
        $category_id = Category::where('slug', $request->category)->firstOrfail();
        $data['category_id'] = $category_id->id;
        $listing = Listings::create($data);
        foreach ($request->file('images') as $file) {
            $file->store('images', 'public');
            $filePath = url('storage/images/' . $file->hashName());
            ListingsImages::create([
                'listing_id' => $listing->id,
                'image' => $filePath
            ]);
        }
        return response()->json($listing);
    }
    public function show(Listings $listing)
    {
        return $listing->load(['images', 'user']);
    }


    public function update(Request $request, Listings $listings)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Listings $listings)
    {
        //
    }
}
