<?php

namespace App\Orchid\Screens\Categories;

use Orchid\Screen\Screen;
use Orchid\Support\Facades\Layout;
use Orchid\Support\Color;
use Orchid\Screen\Repository;
use Orchid\Screen\TD;
use Illuminate\Support\Str;
use App\Models\Categories;
use Illuminate\Http\Request;
use Orchid\Support\Facades\Toast;
use Orchid\Screen\Actions\Link;
use Orchid\Screen\Fields\Input;
use Orchid\Screen\Fields\TextArea;
use Orchid\Screen\Fields\Select;
use Orchid\Screen\Actions\Button;
use Illuminate\Support\Facades\Auth;
use Orchid\Screen\Layouts\Rows;
use Orchid\Platform\Models\User;
use PhpParser\Node\Expr\Cast\String_;

class CategoriesEditScreen extends Screen
{
    /**
     * Display header name.
     *
     * @var string
     */
    public $name = 'Edit category';

    /**
     * Display header description.
     *
     * @var string|null
     */
    public $description = 'Edit a selected category';

    public function query(string $category_id): array
    {
        $this->category_id = $category_id;
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

                TextArea::make('description')
                    ->title('Description')
                    ->rows(6),

                Button::make('Submit')
                    ->method('save')
                    ->type(Color::DEFAULT())
            ])
        ];
    }

    public function save(string $category_id, Request $request)
    {
        $title = $request->get('title');
        $description = $request->get('description');
        $query = Categories::where('id', '=', $category_id);
        if ($title)
            $query->update(['title' => $title]);
        if ($description)
            $query->update(['description' => $description]);
        return redirect()->route('platform.categories.view');
    }
}
