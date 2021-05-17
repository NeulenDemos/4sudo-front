<?php

namespace Database\Seeders;
use Faker\Factory as Faker;
use App\Models\Comments;
use App\Models\Posts;
use App\Models\User;

use Illuminate\Database\Seeder;

class CommentSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        Comments::insert([
            'user_id' => rand(1, User::get()->count()),
            'post_id' => rand(1, Posts::get()->count()),
            'date' => now(),
            'content' => $faker->realText(500),
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
