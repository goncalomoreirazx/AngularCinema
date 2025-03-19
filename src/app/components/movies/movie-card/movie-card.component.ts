import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Movie {
  id: number;
  title: string;
  poster: string;
  year: number;
  director: string;
  genre: string;
  rating: number;
}

@Component({
  selector: 'app-movie-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie-card.component.html',
  styleUrl: './movie-card.component.scss'
})
export class MovieCardComponent {
  @Input() movie!: Movie;
  @Output() viewDetails = new EventEmitter<number>();

  onViewDetails(): void {
    this.viewDetails.emit(this.movie.id);
  }
}