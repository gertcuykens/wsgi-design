/* altered by gert cuykens */
/* AUTEUR: Philippe.Corbes@laposte.net */
/* DATE DE CREATION: 10/5/00 */
/* 17/09/2004 Correction erreur dans table code128 -> certains caracteres etaient mal codes */
/* 18/09/2005 V1.1 Ajout CODE128 avec algorytme d'optimisation du changement de codage CODE128_A, CODE128_B et CODE128_C */
/*                 Ajout d'une zone blanche avant et apres le code */
/*                 Optimisation du code et ajout de comentaires */

// Parameters: type:       barecode type ['CODE128']
//             code:       value to translate
//             withtext:   boolean, True to add text
//             xsize:      size of a line
//             ysize:      the Y size
//             blackImage: a PNG image to build the barecode
//             whiteImage: a PNG image to build the barecode
//             xratio:     the ration between large and small bar
//             xinter:     the space between two digits

barcode=
{
 colors   : new Array('../bin/white.png','../bin/black.png'),
 type     : 'CODE128',
 code     : '',
 withtext : true,
 xsize    : 1,
 ysize    : 50,
 xratio   : 3,
 xinter   : 1,
 // Constants to build the image
 valueA : new String(' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_'
                    +'\x00\x01\x02\x03\x04\x05\x06\x07\x08\x09\x0a\x0b\x0c\x0d\x0e\x0f'
                    +'\x10\x11\x12\x13\x14\x15\x16\x17\x18\x19\x1a\x1b\x1c\x1d\x1e\x1f'),
 valueB : new String(' !"#$%&\'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_'
                    +'`abcdefghijklmnopqrstuvwxyz{|}~\xff'),
 valueC : new String('0123456789'),
 code128 : new Array('212222', '222122', '222221', '121223', '121322', '131222', '122213', '122312', '132212', '221213',
                     '221312', '231212', '112232', '122132', '122231', '113222', '123122', '123221', '223211', '221132',
                     '221231', '213212', '223112', '312131', '311222', '321122', '321221', '312212', '322112', '322211',
                     '212123', '212321', '232121', '111323', '131123', '131321', '112313', '132113', '132311', '211313',
                     '231113', '231311', '112133', '112331', '132131', '113123', '113321', '133121', '313121', '211331',
                     '231131', '213113', '213311', '213131', '311123', '311321', '331121', '312113', '312311', '332111',
                     '314111', '221411', '431111', '111224', '111422', '121124', '121421', '141122', '141221', '112214',
                     '112412', '122114', '122411', '142112', '142211', '241211', '221114', '413111', '241112', '134111',
                     '111242', '121142', '121241', '114212', '124112', '124211', '411212', '421112', '421211', '212141',
                     '214121', '412121', '111143', '111341', '131141', '114113', '114311', '411113', '411311', '113141',
                     '114131', '311141', '411131', '211412', '211214', '211232', '2331112'),
 // Function(s)
 draw:drawCode128
}

function drawCode128(){
// Parameters: barcode:    the code to translate
  var argv = barcode.draw.arguments;
  var argc = barcode.draw.arguments.length;
  if (argc > 0) { barcode.code = argv[0]; }

  var astr = "";
  var barcodeok = (barcode.code != '');
  if (barcodeok == true) barcodeok = ((barcode.type == 'CODE128') || (barcode.type == 'CODE128_A') || (barcode.type == 'CODE128_B') || (barcode.type == 'CODE128_C'))
  if (barcodeok == false) {
    astr = barcode.type+' ??';
  } else {
	var i,j,k,wstr
	var isA,isB,isC

	var thischar = '';
	var thecode = '';
	var typeA = new Array();
	var typeB = new Array();
	var typeC = new Array();
	var codage = new Array();

	if (barcode.type == 'CODE128') {
		// Recherche du type de codage possible pour chaque caractere
		for (i = 0, j = 0; i < barcode.code.length; i++) {
			thischar = barcode.code.charAt(i);
			isA = barcode.valueA.indexOf(thischar);
			isB = barcode.valueB.indexOf(thischar);
			isC = barcode.valueC.indexOf(thischar);
			if ((isA != -1) || (isB != -1) || (isC != -1)) {
				thecode += thischar;
				typeA[j] = isA;
				typeB[j] = isB;
				typeC[j] = isC;
				j += 1;
			}
		}
		// Recherche du meilleur codage A, B ou C
   		var initialiser = true;
		var changer = false;
		var longueur = thecode.length;
        var table

		i = 0;
		while (i < longueur) {

			// Test si besoin de changement de codage
			if ((typeA[i] != -1) || (typeB[i] != -1) || initialiser ) {
				if ((typeC[i] != -1) && (i < (longueur-3))) {
					if ((typeC[i+1] != -1) && (typeC[i+2] != -1) && (typeC[i+3] != -1)) {
						table = 'C';
						initialiser = false;
					}
				}
			}

			if ((typeC[i] == -1) || changer || initialiser ) {
				if ((typeA[i] != -1) && (typeB[i] == -1)) { // si A
					table = 'A';
				} else { // si B
					if ((typeA[i] == -1) && (typeB[i] != -1)) {
						table = 'B';
					} else { // si A et B
						if (i < longueur-1) {
							if (typeB[i+1] != -1) {
								table = 'B';
							} else {
								table = 'A';
							}
						} else {
							table = 'B';
						}
					}
				}
				initialiser = false;
				changer = false;
			}

			// Codage du caractere pointe
			if ((table == 'A') && !changer ) {
				codage[i++] = 'A';
				if (i < longueur) {
					if (typeA[i] == -1) {
						changer = true;
					}
				}
			}

			if ((table == 'B') && !changer ) {
				codage[i++] = 'B';
				if (i < longueur) {
					if (typeB[i] == -1) {
						changer = true;
					}
				}
			}

			if ((table == 'C') && !changer ) {
				while ( !changer) {
					if ((typeC[i] != -1) && (i < longueur-1)) {
						if (typeC[i+1] != -1) {
							codage[i++] = 'C';
							codage[i++] = 'C';
						} else {
							changer = true;
						}
					} else {
						changer = true;
					}
				}
			}

		}
	} else {
		for (i = 0, j = 0; i < barcode.code.length; i++) {
			thischar = barcode.code.charAt(i);
			if (barcode.type == 'CODE128_A') {
				isA = barcode.valueA.indexOf(thischar);
				if (isA != -1) {
					thecode += thischar;
					typeA[j] = isA;
					codage[j] = 'A';
					j += 1;
				}
			}
			if (barcode.type == 'CODE128_B') {
				isB = barcode.valueB.indexOf(thischar);
				if (isB != -1) {
					thecode += thischar;
					typeB[j] = isB;
					codage[j] = 'B';
					j += 1;
				}
			}

			if (barcode.type == 'CODE128_C') {
				isC = barcode.valueC.indexOf(thischar);
					thecode += thischar;
					typeC[j] = isC;
					codage[j] = 'C';
					j += 1;
				}
			}
		}
		// si nombre de caractere impaire en codage CODE128_C, changer le codage du dernier caractere en CODE128_B
		if (barcode.type == 'CODE128_C') {
			if ((j % 2) == 1) {
				typeB[j-1] = barcode.valueB.indexOf(thecode.charAt(j-1));
				codage[j-1] = 'B';
			}
		}
	}
	barcode.code = thecode;

	var codearray = new Array();

	// Codage du Start
	switch (codage[0]) {
	case 'A': {
		codearray[0] = 103;	// Start (Subset A)
		break
		}
	case 'B': {
		codearray[0] = 104;	// Start (Subset B)
		break
		}
	case 'C': {
		codearray[0] = 105;	// Start (Subset C)
		break
		}
	}

	// Codage des caracteres du code
	var famille = codage[0];	// pointe la table de codage actuelle
	var chksum = codearray[0];	//

	k = 1;
	for (i = 0; i < barcode.code.length; i++) {
		if (famille != codage[i]) {	// si Changement de famille, inscerer fonction de control
			switch (codage[i]) {
			case 'A': {			// Subset A
				chksum += (k * 101);
				codearray[k++] = 101;
				break
				}
			case 'B': {			// Subset B
				chksum += (k * 100);
				codearray[k++] = 100;
				break
				}
			case 'C': {			// Subset C
				chksum += (k * 99);
				codearray[k++] = 99;
				break
				}
			}
			famille = codage[i];
		}

		switch (codage[i]) {
		case 'A': {
			j = typeA[i];
			break
			}
		case 'B': {
			j = typeB[i];
			break
			}
		case 'C': {
			j = 10*typeC[i] + typeC[i+1];
			i += 1;		// sauter le deuxieme caractere
			break
			}
		}
		chksum += (k * j);
		codearray[k++] = j;
	}

	// Codage des caracteres de controle
	codearray[k++] = chksum % 103;	// Checksum
	codearray[k++] = 106;		// Stop

	// creation du script de codage des barres
	wstr = "";
	for (i = 0; i < k; i++) wstr += barcode.code128[codearray[i]];

	// Creation finale du tableau d'images
	//astr = '<table border="0" cellspacing="0" cellpadding="0">';
	j = 1;
	if (barcode.withtext) { astr += '<caption align="bottom">'+barcode.code+'</caption>\n'; }
	astr += '<tr><td><img src="'+barcode.colors[0]+'" width="'+10*barcode.xsize+'" height="'+barcode.ysize+'"/></td>\n';
	for (i = 0; i < wstr.length; i++) {
		astr += '<td><img src="'+barcode.colors[j++]+'" width="'+1*wstr.charAt(i)*barcode.xsize+'" height="'+barcode.ysize+'"/></td>\n';
		j %= 2;
	}
	astr += '<td><img src="'+barcode.colors[0]+'" width="'+10*barcode.xsize+'" height="'+barcode.ysize+'"/></td>\n';
	astr += '</tr>';

//  return '<xmp>#' +astr+'#</xmp>';    // debug
	return astr;
}
