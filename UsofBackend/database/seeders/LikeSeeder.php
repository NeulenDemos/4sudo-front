<?php

namespace Database\Seeders;
use Faker\Factory as Faker;
use App\Models\Comments;
use App\Models\Posts;
use App\Models\User;
use App\Models\Likes;

use Illuminate\Database\Seeder;

class LikeSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        $post_id = null;
        $comment_id = null;
        $like = $faker->boolean(70);
        $post_or_comm = $faker->boolean(70);
        if ($post_or_comm) {
            $post_id = rand(1, Posts::get()->count());
            if ($like)
                Posts::find($post_id)->increment('rating');
            else
                Posts::find($post_id)->decrement('rating');
        }
        else
            $comment_id = rand(1, Comments::get()->count());
        Likes::insert([
            'user_id' => rand(1, User::get()->count()),
            'post_id' => $post_id,
            'comment_id' => $comment_id,
            'date' => now(),
            'type' => $like ? 'like' : 'dislike',
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
