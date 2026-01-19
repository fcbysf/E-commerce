<?php

namespace App\Http\Controllers;

use App\Models\Product;
use App\Models\ProductImages;
use Illuminate\Http\Request;

class ProductController extends Controller
{

    public function homeProducts()
    {
        return Product::with('images')
            ->latest()
            ->take(6)
            ->get();
    }
    public function adminProducts()
    {
        return Product::latest()->paginate(6);
    }
    public function index(Request $request)
    {
        $category = $request->category;
        if ($category == 'allCategories') {
            return Product::whereBetween('price', [$request->min, $request->max])->latest()->paginate(6);
        } else {
            return Product::where('category', $category)->whereBetween('price', [$request->min, $request->max])->latest()->paginate(6);
        }
    }


    public function store(Request $request)
    {
        $productData = $request->validate([
            'name' => 'required|min:6',
            'description' => 'required|min:10',
            'image' => 'required|image|file|max:2042',
            'price' => 'required|numeric',
            'discount' => 'nullable',
            'images' => 'required|array',
            'images.*' => 'required|image|file|max:2042',
            'stock' => 'required|numeric',
            'category' => 'nullable'
        ]);
        $file = $request->file('image');
        $file->store('images', 'public');
        $productData['image'] = url('storage/images/' . $file->hashName());
        $product = Product::create($productData);
        if ($request->file('images')) {
            foreach ($request->file('images') as $file) {
                $file->store('images', 'public');
                $filePath = url('storage/images/' . $file->hashName());
                ProductImages::create([
                    'product_id' => $product->id,
                    'image_url' => $filePath
                ]);
            }
        }
        return response()->json($product->load('images'));
    }

    /**
     * Display the specified resource.
     */
    public function show(Product $product)
    {
        return $product->load('images');
    }



    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Product $product)
    {
        $productData = $request->validate([
            'name' => 'sometimes|min:6',
            'description' => 'sometimes|min:10',
            'image' => 'sometimes|image|file|max:2042',
            'price' => 'sometimes|numeric',
            'discount' => 'nullable',
            'images' => 'sometimes|array',
            'images.*' => 'sometimes|image|file|max:2042',
            'stock' => 'sometimes|numeric',
            'category' => 'nullable',
            'deletedImgsIds' => 'sometimes|array'
        ]);
        if ($request->file('image')) {
            $file = $request->file('image');
            $file->store('images', 'public');
            $productData['image'] = url('storage/images/' . $file->hashName());
        }
        $product->update($productData);
        if ($request->file('images')) {
            foreach ($request->file('images') as $file) {
                $file->store('images', 'public');
                $filePath = url('storage/images/' . $file->hashName());
                ProductImages::create([
                    'product_id' => $product->id,
                    'image_url' => $filePath
                ]);
            }
        }
        if ($request->input('deletedImgsIds')) {
            foreach ($request->input('deletedImgsIds') as $id) {
                ProductImages::where('id', $id)->delete();
            }
        }

        return response()->json($product->load('images'));
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product)
    {
        $product->delete();
        return response()->json("product deleted");
    }
    public function sameCategoryProducts(Request $request)
    {
        $category = $request->category;
        return Product::where('category', $category)->latest()->paginate(40);
    }
}
