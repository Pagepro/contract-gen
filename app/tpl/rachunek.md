**Rachunek z dnia**      <span class="data-rachunku"><%= dataRachunku %></span>

za wykonanie pracy zgodnie z umową z dnia <span class="data-umowy"><%= dataUmowy %><span>

<ul class="first-list">
  <li><span>Wystawił/a:</span></dt>
  <%= imie %> <%= nazwisko %></li>
  <li><span>Adres:</span>
  <%= ulicaINumer %>, <%= kodPocztowy %> <%= miejscowosc %></li>
  <li><span>NIP:</span><%= nip %></li> 
  <li><span>PESEL:</span><%= pesel %></li>
</ul>

<ul class="second-list">
	<li><span>kwota brutto:</span>
		<%= kwotaBrutto %> zł
	</li>
	<li><span>koszty uzyskania przychodu (50%):</span>
		<%= kosztyUzyskania(kwotaBrutto).toString().replace('.', ',') %> zł
	</li>
	<li><span>dochód:</span>
		<%= dochod(kwotaBrutto).toString().replace('.', ',') %> zł
	</li>
	<li><span>należny podatek:</span>
		<%= naleznyPodatek(kwotaBrutto).toString().replace('.', ',') %> zł
	</li>
	<li><span><strong>do wypłaty:</strong></span>
		<strong><%= dochod(kwotaBrutto).toString().replace('.', ',') %> zł</strong>
	</li>
</ul>         
          
<div class="amount-in-words"><strong>słownie:</strong><span><%= kwotaNettoSlownie %></span></div>
          
Wymienioną kwotę proszę przekazać na konto bankowe:         
Numer konta: <%= numerKonta %>          
          
Oświadczam, iż nie jestem zarejestrowany/a w urzędzie pracy jako osoba bezrobotna         
          
<div class="signature">
	<span>data</span>
	<span>podpis</span>
</div>
          

### Dane  Twórcy:

<ul class="third-list">
	<li>
		<span>Imię i Nazwisko:</span>
		<%= imie %> <%= nazwisko %>  
	</li>
	<li>
		<span>Adres zamieszkania</span>
		<%= ulicaINumer %>, <%= kodPocztowy %> <%= miejscowosc %> 
	</li>
	<li>
		<span>Pesel</span>
		<%= pesel %>
	</li>
	<li>
		<span>Data urodzenia</span>
		<%= dataUrodzenia %>
	</li>
</ul>
