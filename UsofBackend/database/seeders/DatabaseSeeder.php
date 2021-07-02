<?php

namespace Database\Seeders;

use App\Models\Categories;
use App\Orchid\Screens\Categories\CategoriesScreen;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     *
     * @return void
     */
    public function run()
    {
        foreach(range(1, 10) as $_)
            $this->call(UserSeeder::class);
        foreach(range(1, 10) as $_)
            $this->call(CategorySeeder::class);
        foreach(range(1, 30) as $_)
            $this->call(PostSeeder::class);
        foreach(range(1, 30) as $_)
            $this->call(CommentSeeder::class);
        foreach(range(1, 5) as $_)
            $this->call(LikeSeeder::class);
        $this->call(RoleSeeder::class);
    }
}
