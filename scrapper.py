output = []

with open("preguntas.txt", "r", encoding="UTF-8") as archivo:
    lines = archivo.readlines()
    for index in range(len(lines)//2):
        output.append("create_quest('%s', '%s');\n" % (lines[index*2].strip(), lines[index*2 + 1].strip()))

with open("./js/preguntas.js", "w", encoding="UTF-8") as archivo_out:
    for pregunta in output:
        archivo_out.write(pregunta)