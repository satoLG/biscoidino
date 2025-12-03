// About Section - Brand story
import { Section } from './Section';

export class AboutSection extends Section {
  render(): string {
    return `
      <section id="about" class="about-section">
        <h2 class="trademark-name">HISTÓRIA</h2>
        <div class="about-content" id="aboutContent">
          <div class="typewriter-text" id="typewriterText">
            <p>A Biscoidino nasceu de uma inesperada oportunidade de se reinventar.</p>
            
            <div class="about-row right">
              <img src="/about/tea.png" class="scroll-image" data-paragraph="1">
              <p class="right-p">Quando Micaela, que trabalhava com finanças há mais de 15 anos, viu sua rotina mudar radicalmente com o diagnóstico de TEA de seu filho Lucas.</p>
            </div>
            
            <div class="about-row left">
              <p class="left-p">Imediatamente deixou seu emprego e passou a se dedicar em tempo integral ao tratamento e cuidados dele.</p>
              <img src="/about/mae_filho.png" class="scroll-image" data-paragraph="2" style="padding-top: 55px !important; padding-bottom: 0;">
            </div>
            
            <div class="about-row right">
              <img src="/biscuits/biscoidino_biscuit1.png" class="scroll-image" data-paragraph="3">
              <p class="right-p">Lucas ama dinossauros, disso surgiu a ideia de assar biscoitos nesse formato para se tornarem mais atrativos para ele.</p>
            </div> 
            
            <div class="about-row left">
              <p class="left-p">Sem nenhuma expectativa, levamos pra algumas pessoas experimentarem e rapidamente a receita se tornou um sucesso. 💚</p>
              <img src="/about/estoque.png" class="scroll-image" data-paragraph="4">
            </div>  
          </div>
        </div>
      </section>
    `;
  }

  init(): void {
    this.element = document.getElementById('about');
  }
}
