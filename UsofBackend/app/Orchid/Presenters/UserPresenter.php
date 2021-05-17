<?php

declare(strict_types=1);

namespace App\Orchid\Presenters;

use Laravel\Scout\Builder;
use Orchid\Screen\Contracts\Personable;
use Orchid\Screen\Contracts\Searchable;
use Orchid\Support\Presenter;
use Orchid\Support\Facades\Toast;

class UserPresenter extends Presenter implements Searchable, Personable
{
    /**
     * @return string
     */
    public function label(): string
    {
        return 'Users';
    }

    /**
     * @return string
     */
    public function title(): string
    {
        return $this->entity->name;
    }

    /**
     * @return string
     */
    public function subTitle(): string
    {
        $roles = $this->entity->roles->pluck('name')->implode(' / ');

        return empty($roles)
            ? __('Regular user')
            : $roles;
    }

    /**
     * @return string
     */
    public function url(): string
    {
        return route('platform.systems.users.edit', $this->entity);
    }

    /**
     * @return string
     */
    public function image(): ?string
    {
        $pic = $this->entity->picture;
        if (gettype($pic) === 'integer')
            $pic .= '.jpg';
        return "/storage/images/".$pic;
    }

    /**
     * The number of models to return for show compact search result.
     *
     * @return int
     */
    public function perSearchShow(): int
    {
        return 3;
    }

    /**
     * @param string|null $query
     *
     * @return Builder
     */
    public function searchQuery(string $query = null): Builder
    {
        return $this->entity->search($query);
    }
}
