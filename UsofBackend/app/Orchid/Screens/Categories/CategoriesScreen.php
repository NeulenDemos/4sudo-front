<?php

namespace App\Orchid\Screens\Categories;

use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Screen\Repository;
use Orchid\Screen\TD;
use Illuminate\Support\Str;
use App\Models\Categories;
use Orchid\Support\Facades\Toast;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Actions\Button;
use Orchid\Screen\Actions\DropDown;

class CategoriesScreen extends Screen
{
    /**
     * Display header name.
     *
     * @var string
     */
    public $name = 'Categories';

    /**
     * Display header description.
     *
     * @var string|null
     */
    public $description = 'View all categories';

    public function commandBar(): array
    {
        return [
            Link::make(__('Create category'))
            ->icon('plus')
            ->route('platform.categories.create'),
        ];
    }

    public function query(): array
    {
        $categories = [];
        $result = Categories::query()->get()->all();
        foreach ($result as $value)
            array_push($categories, new Repository($value->toArray()));
        return [
            'categories' => $categories,
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
            Layout::table('categories', [
                TD::make('id', 'ID')
                    ->width('150')
                    ->render(function (Repository $model) {
                        // Please use view('path')
                        return $model->get('id');
                    }),

                TD::make('title', 'Title')
                    ->width('250')
                    ->render(function (Repository $model) {
                        return Str::limit($model->get('title'), 200);
                    }),

                TD::make('description', 'Description')
                    ->width('550')
                    ->render(function (Repository $model) {
                        return Str::limit($model->get('description'), 200);
                    }),

                TD::make(__('Actions'))
                    ->align(TD::ALIGN_CENTER)
                    ->width('100px')
                    ->render(function (Repository $model) {
                        return DropDown::make()
                            ->icon('options-vertical')
                            ->list([
                                Link::make(__('Edit'))
                                    ->route('platform.categories.edit', $model->get('id'))
                                    ->icon('pencil'),

                                Button::make(__('Delete'))
                                    ->icon('trash')
                                    ->method('remove')
                                    ->confirm(__('Are you sure to delete this category?'))
                                    ->parameters([
                                        'category_id' => $model->get('id'),
                                    ]),
                            ]);
                    }),
            ]),
        ];
    }
    function remove($category_id) {
        Categories::find($category_id)->delete();
    }
}
