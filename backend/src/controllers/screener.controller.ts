import { Controller, Get, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { catchError } from 'rxjs/operators';
import { ScreenerService } from '../services/screener.service';
import { ScreenerResponseDto } from '../dto/screener-response.dto';

@Controller('screener')
export class ScreenerController {
  constructor(private readonly screenerService: ScreenerService) {}

  private handleError(error: any) {
    throw new HttpException(
      error.message || 'Internal server error',
      error.status || HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  @Post('evaluate')
  evaluateScreener(@Body() screenerResponse: ScreenerResponseDto) {
    try {
      return this.screenerService.evaluateScreener(screenerResponse.answers);
    } catch (error) {
      this.handleError(error);
    }
  }

  @Get()
  getScreener() {
    try {
      return this.screenerService.getScreener();
    } catch (error) {
      this.handleError(error);
    }
  }
}
