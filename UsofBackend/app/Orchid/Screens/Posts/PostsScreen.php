<?php

namespace App\Orchid\Screens\Posts;

use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Screen\Repository;
use Orchid\Screen\TD;
use Illuminate\Support\Str;
use App\Models\Posts;
use Orchid\Support\Facades\Toast;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;

class PostsScreen extends Screen
{
    /**
     * Display header name.
     *
     * @var string
     */
    public $name = 'Posts';

    /**
     * Display header description.
     *
     * @var string|null
     */
    public $description = 'View all posts';

    public function commandBar(): array
    {
        return [
            Link::make(__('Create post'))
            ->icon('plus')
            ->route('platform.posts.create'),
        ];
    }

    public function query(): array
    {
        $posts = [];
        $result = Posts::query()->get()->all();
        foreach ($result as $value)
            array_push($posts, new Repository($value->toArray()));
        return [
            'posts' => $posts,
        ];
    }


    /**
     * Views.
     *
     * @return string[]|\Orchid\Screen\Layout[]
     */
    public function layout(): array
    {
        return [
            Layout::table('posts', [
                TD::make('id', 'ID')
                    ->width('150')
                    ->render(function (Repository $model) {
                        // Please use view('path')
                        return $model->get('id');
                    }),

                TD::make('title', 'Title')
                    ->width('450')
                    ->render(function (Repository $model) {
                        return Str::limit($model->get('title'), 200);
                    }),

                TD::make('content', 'Content')
                    ->width('450')
                    ->render(function (Repository $model) {
                        return Str::limit($model->get('content'), 200);
                    }),

                TD::make('rating', 'Rating')
                    ->render(function (Repository $model) {
                        return number_format($model->get('rating'), 1);
                    }),

                TD::make('categories', 'Categories')
                    ->width('450')
                    ->render(function (Repository $model) {
                        return implode(", ", json_decode($model->get('categories')));
                    }),

                TD::make('status', 'Status')
                    ->width('450')
                    ->render(function (Repository $model) {
                        return $model->get('status') == 1 ? 'Active' : 'Blocked';
                    }),

                TD::make('date', 'Date')
                    ->render(function (Repository $model) {
                        return date('d.m.Y H:i', $model->get('date'));
                    }),

                TD::make(__('Actions'))
                    ->align(TD::ALIGN_CENTER)
                    ->width('100px')
                    ->render(function (Repository $model) {
                        return DropDown::make()
                            ->icon('options-vertical')
                            ->list([
                                Link::make(__('Edit'))
                                    ->route('platform.posts.edit', $model->get('id'))
                                    ->icon('pencil'),

                                Button::make(__('Delete'))
                                    ->icon('trash')
                                    ->method('remove')
                                    ->confirm(__('Are you sure to delete this post?'))
                                    ->parameters([
                                        'post_id' => $model->get('id'),
                                    ]),
                            ]);
                    }),
            ]),
        ];
    }
    function remove($post_id) {
        Posts::find($post_id)->delete();
    }
}
