<?php

namespace Database\Seeders;
use Faker\Factory as Faker;
use App\Models\Categories;

use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        Categories::insert([
            'title' => $faker->unique()->text(32),
            'description' => $faker->realText(256),
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
