<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateOrchidUsersTable extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::table('users', function (Blueprint $table) {


            $table->id();
            $table->string('username',10)->unique()->default(NULL);
            $table->string('password',64);
            $table->string('name',20);
            $table->string('email',64)->unique();
            $table->integer('picture',)->unsigned()->default(0);
            $table->integer('rating',)->default(0);
            $table->enum('role',['user','admin'])->default('user');
            $table->jsonb('permissions')->nullable();
            $table->timestamps();

        });
    }

    /**
     * Reverse the migrations.
     */
    public function down()
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['permissions']);
        });
    }
}
