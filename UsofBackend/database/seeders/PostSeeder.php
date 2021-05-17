<?php

namespace Database\Seeders;
use Faker\Factory as Faker;
use App\Models\Posts;
use App\Models\User;
use App\Models\Categories;

use Illuminate\Database\Seeder;

class PostSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        $cat_arr = [];
        $cat_all = Categories::get()->count();
        $cat_count = rand(1, $cat_all);
        foreach (range(1, $cat_count) as $_) {
            $cat = strval(rand(1, $cat_all));
            if (array_search($cat, $cat_arr) === false)
                array_push($cat_arr, $cat);
        }
        Posts::insert([
            'user_id' => rand(1, User::get()->count()),
            'title' => $faker->sentence(5),
            'date' => now(),
            'status' => $faker->boolean(90),
            'content' => $faker->realText(500),
            'categories' => json_encode($cat_arr),
            'rating' => 0,
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
