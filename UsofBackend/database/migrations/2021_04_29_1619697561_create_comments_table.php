<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateCommentsTable extends Migration
{
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {

        $table->id();
		$table->unsignedBigInteger('user_id',);
		$table->unsignedBigInteger('post_id',)->nullable()->default(NULL);
		$table->unsignedBigInteger('comment_id',)->nullable()->default(NULL);
		$table->timestamp('date')->useCurrent();
        $table->string('content',4096);
		$table->boolean('best')->default(FALSE);
        $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        $table->foreign('post_id')->references('id')->on('posts')->onDelete('cascade');
        $table->timestamps();

        });
    }

    public function down()
    {
        Schema::dropIfExists('comments');
    }
}
?>
