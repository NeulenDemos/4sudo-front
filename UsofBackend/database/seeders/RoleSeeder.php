<?php

namespace Database\Seeders;
use Illuminate\Support\Facades\DB;

use Illuminate\Database\Seeder;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        DB::table('roles')->insert([[
            'name' => 'admin',
            'slug' => 'admin',
            'permissions' => '{"platform.index": "1", "platform.systems.roles": "1", "platform.systems.users": "1", "platform.systems.attachment": "1"}',
            'created_at' => now(),
            'updated_at' => now()
        ], [
            'name' => 'user',
            'slug' => 'user',
            'permissions' => '{"platform.index": "1", "platform.systems.roles": "0", "platform.systems.users": "0", "platform.systems.attachment": "0"}',
            'created_at' => now(),
            'updated_at' => now()
        ]]);
    }
}
