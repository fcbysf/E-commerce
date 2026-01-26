<?php

namespace App\Http\Controllers;

use App\Http\Requests\ListingsRequest;
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
        return Listings::with("images")->where('status', 'active')->latest()->paginate(6);
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
            'price' => 'required|numeric|min:0',
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
        return $listing->load(['images', 'user', 'category']);
    }


    public function update(ListingsRequest $request, Listings $listing)
    {
        $updatedData = $request->validated();
        if ($request->status == "sold") {
            $listing->status = $request->status;
            $listing->save();
            return response()->json($listing);
        }
        if ($request->status == "active") {
            $listing->status = $request->status;
            $listing->save();
            return response()->json($listing);
        }
        if ($request->category) {
            $category_id = Category::where('slug', $request->category)->firstOrfail();
            $updatedData['category_id'] = $category_id->id;
        }
        if ($request->location) {
            $updatedData['city'] = $request->location;
            $updatedData['country'] = null;
        }
        if ($request->images) {
            foreach ($request->file('images') as $file) {
                $file->store('images', 'public');
                $filePath = url('storage/images/' . $file->hashName());
                ListingsImages::create([
                    'listing_id' => $listing->id,
                    'image' => $filePath
                ]);
            }
        }
        if ($request->deletedImgsIds) {
            foreach ($request->deletedImgsIds as $id) {
                $img = ListingsImages::where('id', $id)->first();
                $img->delete();
            }
        }
        $listing->update($updatedData);
        return response()->json('updated');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Listings $listing)
    {
        $listing->delete();
        return response()->json("listing deleted");
    }
}
