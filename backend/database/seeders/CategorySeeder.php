<?php

namespace Database\Seeders;

use App\Models\Categories;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            'Clothing',
            'Vehicles',
            'Property for rent',
            'Classifieds',
            'Electronics',
            'Entertainment',
            'Family',
            'Free stuff',
            'Garden and outdoors',
            'Hobbies',
            'Home goods',
            'Home improvement supplies',
            'Musical instruments',
            'Office supplies',
            'Pet supplies',
            'Property for sale',
            'Sporting goods',
            'Toys and games',
            'Buy and sell groups',
        ];
        foreach ($categories as $category) {
            Categories::create([
                'name' => $category,
                'slug' => Str::slug($category)
            ]);
        }
    }
}
