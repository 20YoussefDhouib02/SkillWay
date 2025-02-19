import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';  
import { HeaderComponent } from '../header/header.component';
import { RouterLink } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { FormsModule } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { SafeHtml } from '@angular/platform-browser';

@Component({
  selector: 'app-ai-roadmap',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterLink, FooterComponent, FormsModule],
  templateUrl: './ai-roadmap.component.html',
  styleUrls: ['./ai-roadmap.component.css']
})
export class AiRoadmapComponent {

  userPrompt: string = '';
  chatResponse: string = '';
  transformedResponse: SafeHtml = '';
  isLoading: boolean = false;

  constructor(private http: HttpClient, private sanitizer: DomSanitizer) {}

  async sendPrompt() {
    if (!this.userPrompt.trim()) return;
    this.isLoading = true;

    const payload = {
      model: "deepseek/deepseek-chat:free",
      messages: [{
        role: "user",
        content: `I want to learn ${this.userPrompt}. Can you provide advice and actionable steps on how to acquire this skill?`
      }]
    };

    const headers = {
      'Authorization': `Bearer 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`, // Replace with your actual API key
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    try {
      const response = await this.http.post<any>(
        'https://openrouter.ai/api/v1/chat/completions',
        payload,
        { headers }
      ).toPromise();

      // Replace literal "\n" with actual newlines
      let responseText = response.choices[0].message.content.replace(/\\n/g, '\n');
      this.chatResponse = responseText;
      // Transform the markdown-like syntax into HTML
      const transformed = this.transformMarkdown(responseText);
      this.transformedResponse = this.sanitizer.bypassSecurityTrustHtml(transformed);
    } catch (error) {
      console.error('Error fetching chat response:', error);
      this.chatResponse = 'Sorry, an error occurred. Please try again.';
      this.transformedResponse = this.chatResponse;
    } finally {
      this.isLoading = false;
      this.userPrompt = '';
    }
  }

  /**
   * Transforms markdown-like syntax:
   * - Lines starting with "##" become <h2> elements.
   * - Text wrapped in ** becomes bold.
   */
  private transformMarkdown(text: string): string {
    const lines = text.split('\n');
    const processedLines = lines.map(line => {
      let processedLine = line;
      // Convert header lines that start with "##"
      if (line.trim().startsWith('##')) {
        processedLine = `<h4>${line.replace(/^##\s*/, '')}</h4>`;
      } 
      // Replace **text** with <strong>text</strong>
      processedLine = processedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return processedLine;
    });
    // Join the lines with <br> to preserve line breaks for non-header lines
    return processedLines.join('<br>');
  }


}
