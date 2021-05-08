<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreatePostsTable extends Migration
{
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {

        $table->id();
		$table->unsignedBigInteger('user_id',);
		$table->string('title',32);
		$table->timestamp('date')->useCurrent();
		$table->boolean('status')->default(TRUE);
		$table->string('content',4096);
		$table->string('categories',1024)->default('[]');
        $table->integer('rating')->default(0);
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        $table->timestamps();

        });
    }

    public function down()
    {
        Schema::dropIfExists('posts');
    }
}
?>
