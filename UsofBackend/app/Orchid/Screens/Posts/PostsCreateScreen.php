<?php

namespace App\Orchid\Screens\Posts;

use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Color;
use Orchid\Screen\Repository;
use Orchid\Screen\TD;
use Illuminate\Support\Str;
use App\Models\Posts;
use Illuminate\Http\Request;
use Orchid\Support\Facades\Toast;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Actions\Button;
use App\Models\Categories;
use Illuminate\Support\Facades\Auth;
use Orchid\Screen\Layouts\Rows;
use Orchid\Platform\Models\User;


class PostsCreateScreen extends Screen
{
    /**
     * Display header name.
     *
     * @var string
     */
    public $name = 'Create post';

    /**
     * Display header description.
     *
     * @var string|null
     */
    public $description = 'Create a new post';

    public function query(): array
    {
        return [];
    }

    /**
     * Views.
     *
     * @return string[]|\Orchid\Screen\Layout[]
     */
    public function layout(): array
    {
        return [
            Layout::rows([
                Input::make('title')
                    ->title('Title')
                    ->required(),

                TextArea::make('content')
                    ->title('Content')
                    ->rows(6)
                    ->required(),

                Select::make('categories')
                    ->title('Categories')
                    ->multiple()
                    ->required()
                    ->options($this->getCategories()),

                Button::make('Submit')
                    ->method('save')
                    ->type(Color::DEFAULT())
            ])
        ];
    }

    private function getCategories(): array
    {
        $result = [];
        $categories = Categories::get(['id', 'title'])->all();
        foreach ($categories as $value)
            $result[$value['id']] = $value['title'];
        return $result;
    }

    public function save(Request $request)
    {
        $title = $request->get('title');
        $content = $request->get('content');
        $categories = json_encode($request->get('categories'));
        Posts::query()->create(['user_id' => Auth::user()->id, 'title' => $title, 'content' => $content, 'categories' => $categories]);
        return redirect()->route('platform.posts.view');
    }
}
