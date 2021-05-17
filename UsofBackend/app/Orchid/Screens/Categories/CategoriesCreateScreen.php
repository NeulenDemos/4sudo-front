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


class CategoriesCreateScreen extends Screen
{
    /**
     * Display header name.
     *
     * @var string
     */
    public $name = 'Create category';

    /**
     * Display header description.
     *
     * @var string|null
     */
    public $description = 'Create a new category';

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

                TextArea::make('description')
                    ->title('Description')
                    ->rows(6)
                    ->required(),

                Button::make('Submit')
                    ->method('save')
                    ->type(Color::DEFAULT())
            ])
        ];
    }

    public function save(Request $request)
    {
        $title = $request->get('title');
        $description = $request->get('description');
        Categories::create(['title' => $title, 'description' => $description]);
        return redirect()->route('platform.categories.view');
    }
}
