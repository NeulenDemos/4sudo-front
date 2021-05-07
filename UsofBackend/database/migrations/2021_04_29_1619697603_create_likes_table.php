<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateLikesTable extends Migration
{
    public function up()
    {
        Schema::create('likes', function (Blueprint $table) {

        $table->id();
		$table->unsignedBigInteger('user_id',);
		$table->timestamp('date')->useCurrent();
		$table->unsignedBigInteger('post_id',)->default(0);
		$table->unsignedBigInteger('comment_id',)->default(0);
		$table->enum('type',['like','dislike']);
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade')->default(NULL);
        $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade')->default(NULL);
        $table->foreign('comment_id')->references('id')->on('comments')->onDelete('cascade');
        $table->timestamps();

        });
    }

    public function down()
    {
        Schema::dropIfExists('likes');
    }
}
?>
