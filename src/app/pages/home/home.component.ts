import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { FooterComponent } from '../../components/footer/footer.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, NavbarComponent, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  featuredMovies = [
    {
      id: 1,
      title: 'The Matrix Resurrections',
      genre: 'Sci-Fi',
      rating: 4.3,
      imageUrl: '/assets/images/matrix.png',
      releaseDate: '2023-12-22'
    },
    {
      id: 2,
      title: 'Dune',
      genre: 'Adventure',
      rating: 4.7,
      imageUrl: '/assets/images/dune.jpeg',
      releaseDate: '2023-10-22'
    },
    {
      id: 3,
      title: 'Spider-Man: No Way Home',
      genre: 'Action',
      rating: 4.8,
      imageUrl: '/assets/images/spiderman.jpg',
      releaseDate: '2023-12-17'
    },
    {
      id: 4,
      title: 'The Batman',
      genre: 'Action',
      rating: 4.5,
      imageUrl: '/assets/images/batman.jpg',
      releaseDate: '2023-03-04'
    }
  ];

  comingSoonMovies = [
    {
      id: 5,
      title: 'Minecraft',
      genre: 'Action',
      imageUrl: '/assets/images/minecraft.jpg',
      releaseDate: '2024-07-29'
    },
    {
      id: 6,
      title: 'Lilo e Stitch',
      genre: 'Action',
      imageUrl: '/assets/images/lilo.jpg',
      releaseDate: '2024-07-08'
    },
    {
      id: 7,
      title: 'Branca de Neve',
      genre: 'Sci-Fi',
      imageUrl: '/assets/images/branca.jpeg',
      releaseDate: '2024-12-16'
    },
    {
      id: 8,
      title: 'Solo Leveling',
      genre: 'Action',
      imageUrl: '/assets/images/solo.jpg',
      releaseDate: '2024-05-27'
    }
  ];
}