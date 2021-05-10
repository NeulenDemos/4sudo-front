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
        Schema::create('users', function (Blueprint $table) {

            $table->id();
            $table->string('login',10)->unique()->nullable()->default(NULL);
            $table->string('password',64);
            $table->string('name',20);
            $table->string('email',64)->unique();
            $table->string('picture',15)->nullable()->default(NULL);
            $table->string('favorites',4096)->default('[]');
            $table->integer('rating',)->default(0);
            $table->enum('role',['user','admin'])->default('user');
            $table->jsonb('permissions')->nullable();
            $table->timestamp('email_verified_at')->nullable();
            $table->rememberToken();
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
