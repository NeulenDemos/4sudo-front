<?php

namespace Database\Seeders;
use Faker\Factory as Faker;
use App\Models\User;

use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Faker::create();
        User::insert([
            'login' => substr($faker->unique()->userName, 0, 10),
            'email' => $faker->unique()->safeEmail,
            'name' => substr($faker->name(), 0, 20),
            'password' => '$2y$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            'created_at' => now(),
            'updated_at' => now()
        ]);
    }
}
