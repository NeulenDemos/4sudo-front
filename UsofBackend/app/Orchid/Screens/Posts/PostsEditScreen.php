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
use PhpParser\Node\Expr\Cast\String_;

class PostsEditScreen extends Screen
{
    /**
     * Display header name.
     *
     * @var string
     */
    public $name = 'Edit post';

    /**
     * Display header description.
     *
     * @var string|null
     */
    public $description = 'Edit a selected post';

    public function query(string $post_id): array
    {
        $this->post_id = $post_id;
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
                    ->title('Title'),

                TextArea::make('content')
                    ->title('Content')
                    ->rows(6),

                Select::make('categories')
                    ->title('Categories')
                    ->multiple()
                    ->options($this->getCategories()),

                Select::make('status')
                    ->title('Status')
                    ->options([1 => 'Active', 0 => 'Blocked']),

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

    public function save(string $post_id, Request $request)
    {
        $title = $request->get('title');
        $content = $request->get('content');
        $status = $request->get('status');
        $categories = $request->get('categories');
        $query = Posts::query()->where('id', '=', $post_id);
        if ($title)
            $query->update(['title' => $title]);
        if ($content)
            $query->update(['content' => $content]);
        if ($status == 0 || $status == 1)
            $query->update(['status' => $status]);
        if ($categories)
            $query->update(['categories' => json_encode($categories)]);
        return redirect()->route('platform.posts.view');
    }
}
