import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Hero, Publisher } from '../../interfaces/hero.interface';
import { HeroesService } from '../../services/heroes.service';
import { ActivatedRoute, Router } from '@angular/router';
import { filter, switchMap } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmDialogComponent } from '../../components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-new-page',
  standalone: false,
  templateUrl: './new-page.component.html',
  styles: ``,
})
export class NewPageComponent implements OnInit {
  public heroForm = new FormGroup({
    id: new FormControl<string>(''),
    superhero: new FormControl<string>('', { nonNullable: true }),
    publisher: new FormControl<Publisher>(Publisher.DCComics),
    alter_ego: new FormControl(''),
    first_appearance: new FormControl(''),
    characters: new FormControl(''),
    alt_img: new FormControl(''),
  });

  public publishers = [
    {
      id: 'DC Comics',
      desc: 'DC - Comics',
    },
    {
      id: 'Marvel Comics',
      desc: 'Marvel - Comics',
    },
  ];

  get currentHero(): Hero {
    const hero = this.heroForm.value as Hero;
    return hero;
  }

  constructor(
    private heroesServices: HeroesService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {}
  ngOnInit(): void {
    if (!this.router.url.includes('edit')) return;

    this.activatedRoute.params
      .pipe(switchMap(({ id }) => this.heroesServices.getHeroById(id)))
      .subscribe((hero) => {
        if (!hero) return this.router.navigateByUrl('/heroes/list');
        this.heroForm.reset(hero);
        return;
      });
  }

  onSubmit() {
    if (this.heroForm.invalid) return;
    if (this.currentHero.id) {
      this.heroesServices.updateHero(this.currentHero).subscribe((hero) => {
        this.showSnackBar(`Hero updated ${hero.superhero}`);
      });

      return;
    }
    this.heroesServices.addHero(this.currentHero).subscribe((hero) => {
      this.router.navigateByUrl('/heroes/edit/' + hero.id);
      this.showSnackBar(`Hero created ${hero.superhero}`);
    });
  }

  onDeleteHero() {
    if (!this.currentHero.id) throw new Error('No hero to delete');
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: this.heroForm.value,
    });

    dialogRef
      .afterClosed()
      .pipe(
        filter((result) => result),
        switchMap(() => this.heroesServices.deleteHero(this.currentHero.id)),
        filter((wasDeleted) => wasDeleted)
      )
      .subscribe((result) => {
        this.router.navigateByUrl('/heroes/list');
        this.showSnackBar(`Hero deleted`);
      });

    // dialogRef.afterClosed().subscribe((result) => {
    //   if (!result) return;
    //   this.heroesServices.deleteHero(this.currentHero.id).subscribe((resp) => {
    //     this.router.navigateByUrl('/heroes/list');
    //     this.showSnackBar(`Hero deleted`);
    //   });
    // });
  }
  showSnackBar(message: string) {
    this.snackBar.open(message, 'done', {
      duration: 2500,
    });
  }
}
