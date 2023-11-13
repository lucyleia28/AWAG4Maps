package AWAG4Maps;

import java.io.BufferedInputStream;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.FileReader;
import java.io.FileWriter;
import java.io.FilterInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.io.StringWriter;
import java.io.UnsupportedEncodingException;
import java.io.Writer;
import java.lang.reflect.Array;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.ByteBuffer;
import java.nio.channels.Channels;
import java.nio.channels.FileChannel;
import java.nio.channels.ReadableByteChannel;
import java.nio.charset.CharacterCodingException;
import java.nio.charset.Charset;
import java.nio.charset.CharsetDecoder;
import java.nio.file.CopyOption;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.ArrayList;
import java.util.Enumeration;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.concurrent.TimeUnit;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;

import io.swagger.codegen.SwaggerCodegen;
import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.stream.XMLOutputFactory;
import javax.xml.stream.XMLStreamException;
import javax.xml.stream.XMLStreamWriter;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerException;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;

import org.eclipse.emf.common.util.BasicEList;
import org.eclipse.emf.common.util.EList;
import org.eclipse.emf.common.util.URI;
import org.eclipse.emf.ecore.EAttribute;
import org.eclipse.emf.ecore.EClass;
import org.eclipse.emf.ecore.EFactory;
import org.eclipse.emf.ecore.EObject;
import org.eclipse.emf.ecore.EPackage;
import org.eclipse.emf.ecore.EcoreFactory;
import org.eclipse.emf.ecore.EcorePackage;
import org.eclipse.emf.ecore.resource.Resource;
import org.eclipse.emf.ecore.resource.ResourceSet;
import org.eclipse.emf.ecore.resource.impl.ResourceSetImpl;
import org.eclipse.emf.ecore.xmi.impl.EcoreResourceFactoryImpl;
import org.eclipse.emf.ecore.xmi.impl.XMIResourceFactoryImpl;
import org.eclipse.emf.ecore.xmi.impl.XMLResourceFactoryImpl;
import org.eclipse.m2m.atl.emftvm.standalone.ATLRunner;

import cs.ualberta.launcher.*;

import org.apache.commons.codec.binary.Hex;
import org.apache.commons.io.ByteOrderMark;
import org.apache.commons.io.FileUtils;
import org.apache.commons.io.input.BOMInputStream;
import org.apache.commons.lang3.StringUtils;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.json.XML;
import org.w3c.dom.Attr;
import org.w3c.dom.Document;
import org.w3c.dom.Element;
import org.w3c.dom.Node;
import org.w3c.dom.NodeList;
import org.xml.sax.SAXException;

import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.SerializationFeature;
import com.opencsv.CSVReader;
import com.opencsv.exceptions.CsvValidationException;

public class AWAG4Maps {

	// Variables
	public static String fileName = "data";
	public static String fileUrl = "";
	public static String defaultFileName = "data";
	public static String newfileName = "data";
	public static String desiredFileName = "data";
	public static String fileType = "csv";
	public static String alternativeFileType = "";
	public static String modelFileName = "table.xmi";
	public static String host = "server.com";
	public static String basePath = "/resource";
	public static String swaggerFileName = "swagger.json";
	public static String openAPIFileName = "openapi.json";
	public static String openAPIXMIFileName = "openapi.xmi";
	// NUEVO
	public static String mapXMIFileName = "maps.xmi";
	//public static String swaggerCodegeneFileName = "swagger-codegen-cli-2.2.1.jar";
	public static String apiCodeFolderName = "apiCode";
	public static String serverCodeFileName = "servercode.js";
	public static String resFolderName = "AG";
	public static String apiFolderName = "api";
	public static String tempFolderName = "generated";
	public static String mainFolderName = "AG_data";
	public static String fileSeparatorForResources = "/";
	public static String visualisationMainFolderName = "Visualisacion";
	public static String visualisationChartJS = "visualisation.html";
	public static String visualisationZipFileName = visualisationMainFolderName + ".zip";
	public static String visualisationProjectName = "ChartsDemo-macOS";
	public static String visualisationFolderName = "Demos";
	public static String visualisationSwiftFileName = "BarDemoViewController.swift";
	public static String visualisationSwiftFileName2 = "LineDemoViewController.swift";
	public static String visualisationSwiftFileName3 = "PieDemoViewController.swift";
	public static String visualisationSwiftFileName3Tab = "CustomPieTab.swift";

	public static boolean m2mTransformation = false;
	public static boolean openapi2api = false;
	public static boolean xmi2json = false;
	public static boolean xmi2api = false;
	public static boolean csv2api = false;
	public static boolean csv2openapi = false;
	// NUEVO
	public static boolean csv2xmi = false;
	
	public static void main(String[] args) {
		
		if(args.length > 0) {
			switch (args[0]) {
				// ORIGINAL -> csv2api(args)
				case "csv2xmi" : csv2xmi(args);
					break;
				default : System.out.println("No operation called: try csv2xmi");
					break;
			}
		} else {
			//Default operation without parameters
			csv2xmi(args);
		}       
	}
	
	// Formatea los parametros que se le pasan: nombre csv, nombre del modelo, etc
	private static void csv2xmi(String[] args) {
		System.out.println("csv2xmi");

		//args: csv2xmi
		csv2xmi = true;
		
		//args: csv2xmi data
		if(args.length == 2) { // Si tiene 2 argumentos: operacion(csv2xmi)->args[0] y nombre csv->args[1]
			fileName = args[1];
			if(fileName.contains("/")) {
				fileUrl = fileName;
				fileName = fileName.split("/")[fileName.split("/").length-1];
			}
			if(fileName.contains(".csv")) {
				fileName = fileName.replace(".csv", "");
			}
			desiredFileName = fileName;
		} 
		//args: csv2xmi data table.xmi 
		else if(args.length == 3) { // los 2 primeros + nombre xmi a generar
			fileName = args[1];
			if(fileName.contains("/")) {
				fileUrl = fileName;
				fileName = fileName.split("/")[fileName.split("/").length-1];
			}
			if(fileName.contains(".csv")) {
				fileName = fileName.replace(".csv", "");
			}
			desiredFileName = fileName;
			modelFileName = args[2];
		}
		//args: csv2xmi data table.xmi maps.xmi 
		else if(args.length == 4) { // los 3 primeros + nombre xmi modelo del mapa 
			fileName = args[1];
			if(fileName.contains("/")) {
				fileUrl = fileName;
				fileName = fileName.split("/")[fileName.split("/").length-1];
			}
			if(fileName.contains(".csv")) {
				fileName = fileName.replace(".csv", "");
			}
			desiredFileName = fileName;
			modelFileName = args[2];
			mapXMIFileName = args[3];
		}

		mainFolderName = "AWAG4Maps_" + cleanString(desiredFileName);

		convertCSVIntoXMI();
		/*model2modelTransformation();
	    convertXMIintoJSON();
	    generateServer();
        addServerDependencies();
        generateApiCode();
        generateVisualisation();
        runApi();*/
        System.out.println("Automatic API Generation finished!");
		
	}

	@Override
	public String toString() {
		return "AG [getClass()=" + getClass() + ", hashCode()=" + hashCode() + ", toString()=" + super.toString() + "]";
	}
	private static void cleanCSV() {		
		String csvFile = fileName + "." + fileType;
		new File(mainFolderName + File.separator + apiCodeFolderName).mkdirs();  
		
        // Rewrite CSV without rare characters
		CSVReader reader = null;
        String line = "";
        String[] file = null;
        String csvSplitBy = ",";
        ArrayList<String> rows = new ArrayList<String>();


        FileInputStream fis = null;
		try {
			fis = new FileInputStream(csvFile);
		} catch (FileNotFoundException e1) {
			e1.printStackTrace();
		} 
        FilterInputStream  filter = new BufferedInputStream(fis); 
    	BOMInputStream bomIn = new BOMInputStream(filter, ByteOrderMark.UTF_8, ByteOrderMark.UTF_16BE,
    	        ByteOrderMark.UTF_16LE, ByteOrderMark.UTF_32BE, ByteOrderMark.UTF_32LE);
    	
    	try {
			if (bomIn.hasBOM()) {
			    // has a UTF-8 BOM
				System.out.println("has a UTF-8 BOM");
			}
		} catch (IOException e1) {
			e1.printStackTrace();
		}
    	try {
			int firstNonBOMByte = bomIn.read();
		} catch (IOException e1) {
			e1.printStackTrace();
		} // Skips BOM
         
    	FileWriter writer = null;
        try
        {
        	reader = new CSVReader(new InputStreamReader(new FileInputStream(csvFile), "UTF8"));
            writer = new FileWriter(mainFolderName + File.separator + apiCodeFolderName + File.separator + newfileName + "." + fileType);    
            int counter = 0;            
            while ((file = reader.readNext()) != null) {
            	line = "";
                if(counter == 0) {
                	for(int i = 0; i < file.length; i++) {
                		line += cleanString(file[i].replaceAll(",", ".")) + ",";
                	}
                    writer.write(line.substring(0, line.length() - 1));
                } else {
                	for(int i = 0; i < file.length; i++) {
                		line += cleanStringInvalidChars(file[i].replaceAll(",", ".")) + ",";
                	}
                	writer.write(System.lineSeparator());
                    writer.write(line.substring(0, line.length() - 1));
                }
                counter++;
            }
        }
        catch (IOException e)
        {
            e.printStackTrace();
        } catch (CsvValidationException e) {
			e.printStackTrace();
		}
        finally
        {
            try
            {
                reader.close();
                writer.close();
            } 
            catch (IOException e) 
            {
                e.printStackTrace();
            }
        }
	}
	
	private static String cleanString(String s) {
		String aux = "";
		s = s.trim();
		String [] cells = s.split(",");
		
		for(String cell: cells) {
			String auxCell = cell.trim();
			auxCell = StringUtils.stripAccents(cell.replaceAll("\u00f1", "ny").replaceAll(" ", "_").replaceAll("/", "_").replaceAll("\"", "").replaceAll("\'", "")
	        		.replaceAll("\\?", "").replaceAll("\\+", "plus").replaceAll("\\-", "minus").replaceAll("\\(", "_").replaceAll("\\)", "_")
	        		.replaceAll("\\[", "_").replaceAll("\\]", "_").replaceAll("\\{", "_").replaceAll("\\}", "_"))
	        		.replaceAll("\\P{Print}", "");
			if(auxCell.length() > 0 && auxCell.charAt(0) == '_') {
				auxCell = auxCell.substring(1);
			}
			aux += auxCell + ",";
		}

		if(aux.length() > 0 && aux.charAt(aux.length()-1) == ',') {
			aux = aux.substring(0, aux.length()-1);
		}
		return aux;
	}
	
	private static String cleanStringInvalidChars(String s) {
		return StringUtils.stripAccents(s.replaceAll("\u00f1", "ny").replaceAll("\"", "").replaceAll("\'", ""))
        		.replaceAll("\\P{Print}", "").trim();
	}

	private static void convertCSVIntoXMI() {
	
		cleanCSV();	    
		
		// Revisar ruta al csv
		String csvFile = mainFolderName + File.separator + apiCodeFolderName + File.separator + newfileName + "." + fileType;
		
		BufferedReader br = null;
        String line = "";
        String csvSplitBy = ",";

        System.out.println("create xmi");

        //Using StAX
        try {
        	
	        XMLOutputFactory xof = XMLOutputFactory.newInstance();
	        new File(mainFolderName + File.separator + tempFolderName).mkdirs();
	        XMLStreamWriter xMLStreamWriter = xof.createXMLStreamWriter(
	        		new FileWriter(mainFolderName + File.separator + tempFolderName + File.separator + modelFileName));
    		
			xMLStreamWriter.writeStartDocument();
	        xMLStreamWriter.writeStartElement("table:Table");
	        xMLStreamWriter.writeAttribute("xmi:version", "2.0");
	        xMLStreamWriter.writeAttribute("xmlns:xmi", "http://www.omg.org/XMI");
	        xMLStreamWriter.writeAttribute("xmlns:xsi", "http://www.w3.org/2001/XMLSchema-instance");
	        xMLStreamWriter.writeAttribute("xmlns:table", "platform:/resource/TableToMap/MetaModels/Table_MetaModel.ecore"); // REVISAR PORQUE HE PUESTO TABLETOMAP
	        xMLStreamWriter.writeAttribute("filename", cleanString(fileName));
	        
	        try {	        	
	        	br = new BufferedReader(new InputStreamReader(new FileInputStream(csvFile), "UTF8"));
                int i = 0;
                //boolean firstLine = true;
                int limit = 10, counter = 0; 
                int firstLineCells = 0;
                while ((line = br.readLine()) != null && counter < limit) {  
                // while ((line = br.readLine()) != null) {  
                	// Cleaning
                	if(i==0) {
                		line = cleanString(line);
                	} else {
                		line = cleanStringInvalidChars(line);
                	}
                	
                	String[] row = line.split(csvSplitBy);
                	if(i==0) {
                		firstLineCells = row.length;
                	}

        	        xMLStreamWriter.writeStartElement("rows");
        	        xMLStreamWriter.writeAttribute("position", i + "");
        	        
        			for (int j = 0; j < row.length; j++) {
        	    		// cells elements
            	        xMLStreamWriter.writeStartElement("cells");
            	        xMLStreamWriter.writeAttribute("value", row[j]);
                		String cellType = "";
                		try {
                    		if(row[j].equals("" + Integer.parseInt(row[j]))) {
                    			cellType = "integer";
                    		} else if(row[j].equals("" + Float.parseFloat(row[j]))){
                    			cellType = "number";
                    		} else {
                    			cellType = "string";
                    		}
                    	} catch (NumberFormatException e) {
                    		cellType = "string";
                    	}

            	        xMLStreamWriter.writeAttribute("type", cellType);
            	        xMLStreamWriter.writeEndElement();
        				
        			}
        			if(i>0 && row.length < firstLineCells) {
        				for(int k = row.length; k < firstLineCells; k++) {
                	        xMLStreamWriter.writeStartElement("cells");
                	        xMLStreamWriter.writeAttribute("value", "");
                    		String cellType = "string";

                	        xMLStreamWriter.writeAttribute("type", cellType);
                	        xMLStreamWriter.writeEndElement();
        				}
        			}
        			i++;
        	        xMLStreamWriter.writeEndElement();

                    counter++;
                }
                br.close();
            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            } finally {
                if (br != null) {
                    try {
                        br.close();
                    } catch (IOException e) {
                        e.printStackTrace();
                    }
                }
            }
	        
	        xMLStreamWriter.writeEndElement();
	        xMLStreamWriter.writeEndDocument();
	        xMLStreamWriter.flush();
	        xMLStreamWriter.close();
	        
		} catch (XMLStreamException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
	
	private static void model2modelTransformation() { // Se va a usar mas adelante
		try {
            Files.copy(AWAG4Maps.class.getResourceAsStream(fileSeparatorForResources + resFolderName 
            		+ fileSeparatorForResources + "metamodels" + fileSeparatorForResources + "Table.ecore"), 
            		new File(mainFolderName + File.separator + tempFolderName + File.separator + "Table.ecore").toPath(), 
            		StandardCopyOption.REPLACE_EXISTING);
            Files.copy(AWAG4Maps.class.getResourceAsStream(fileSeparatorForResources + resFolderName + 
            		fileSeparatorForResources + "metamodels" + fileSeparatorForResources + "Openapi.ecore"), 
            		new File(mainFolderName + File.separator + tempFolderName + File.separator + "Openapi.ecore").toPath(), 
            		StandardCopyOption.REPLACE_EXISTING);
            Files.copy(AWAG4Maps.class.getResourceAsStream(fileSeparatorForResources + resFolderName + 
            		fileSeparatorForResources + "transformator" + fileSeparatorForResources + "Table2Openapi.atl"), 
            		new File(mainFolderName + File.separator + tempFolderName + File.separator + "Table2Openapi.atl").toPath(), 
            		StandardCopyOption.REPLACE_EXISTING);
            Files.copy(AWAG4Maps.class.getResourceAsStream(fileSeparatorForResources + resFolderName + 
            		fileSeparatorForResources + "transformator" + fileSeparatorForResources
            		+ "Table2Openapi.emftvm"), 
            		new File(mainFolderName + File.separator + tempFolderName + File.separator + "Table2Openapi.emftvm").toPath(), 
            		StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
			System.out.println(e.getMessage());
        }
		
		String tableEcore = mainFolderName + fileSeparatorForResources + tempFolderName + fileSeparatorForResources + "Table.ecore";
		String tableModel = mainFolderName + fileSeparatorForResources + tempFolderName + fileSeparatorForResources + modelFileName;
		String openapiEcore = mainFolderName + fileSeparatorForResources + tempFolderName + fileSeparatorForResources + "Openapi.ecore";
		String openapiModel = mainFolderName + fileSeparatorForResources + tempFolderName + fileSeparatorForResources + openAPIXMIFileName;
		String folder = mainFolderName + fileSeparatorForResources + tempFolderName + fileSeparatorForResources;

		System.out.println("tableEcore" + tableEcore);
		System.out.println("tableModel" + tableModel);
		System.out.println("openapiEcore" + openapiEcore);
		System.out.println("openapiModel" + openapiModel);
		System.out.println("folder" + folder);
		
		Launcher launcher = new Launcher();
		launcher.runATL(tableEcore, "Table", 
				tableModel, openapiEcore, "Openapi", 
				openapiModel, "Table2Openapi", folder);
		
	}

	private static void convertXMIintoJSON() {

		ArrayList<HashMap<String,String>> fullParametersList = new ArrayList<HashMap<String,String>>();
		ArrayList<HashMap<String,String>> parametersList = new ArrayList<HashMap<String,String>>();
		ArrayList<HashMap<String,String>> fullPropertiesList = new ArrayList<HashMap<String,String>>();

		HashMap<String, String> apiHashMap = new HashMap<>();
		apiHashMap.put("fileName", fileName);

		HashMap<String, String> examplesHashMap = new HashMap<>();
		
		String jsonString = "", jsonStringFormatted = "", swaggerString = "", swaggerStringFormatted = "";
		
		try {
            JSONObject xmlJSONObj = XML.toJSONObject(
            		FileUtils.readFileToString(new File(mainFolderName + File.separator + tempFolderName + File.separator + openAPIXMIFileName)));
            
            xmlJSONObj = xmlJSONObj.getJSONObject("openapi:API");
            xmlJSONObj.remove("openapi:API");
            xmlJSONObj.remove("xmi:version");
            xmlJSONObj.remove("xmlns:xmi");
            xmlJSONObj.remove("xmlns:openapi");
            
            //TODO: api description
            //xmlJSONObj = xmlJSONObj.getJSONObject("info").put("description", apiDescription);
            
            JSONArray pathsArray = xmlJSONObj.getJSONArray("paths");
            xmlJSONObj.remove("paths");

        	if (xmlJSONObj.get("servers") instanceof JSONObject) {
            	JSONObject servers = xmlJSONObj.getJSONObject("servers");
                xmlJSONObj.remove("servers");
                JSONArray serversArray = new JSONArray();
                serversArray.put(servers);
                xmlJSONObj.put("servers", serversArray);
        	}
        	
        	JSONArray propertiesArray = xmlJSONObj.getJSONObject("components").getJSONObject("schemas").getJSONObject("mainComponent").getJSONArray("properties");
            xmlJSONObj.getJSONObject("components").getJSONObject("schemas").getJSONObject("mainComponent").remove("properties");
            
            for(int i = 0; i < propertiesArray.length(); i++) {
            	JSONObject jsonobj = propertiesArray.getJSONObject(i);
            	String path = jsonobj.getString("name");
            	
            	jsonobj.remove("name");
            	if(i == 0) {
                	xmlJSONObj.getJSONObject("components").getJSONObject("schemas").getJSONObject("mainComponent").put("properties", new JSONObject());
            	} 
            	JSONObject jsonobj2 = propertiesArray.getJSONObject(i).getJSONObject("content");
            	xmlJSONObj.getJSONObject("components").getJSONObject("schemas").getJSONObject("mainComponent").getJSONObject("properties").put(path, jsonobj2);
             	
            	parametersList.clear();
            	try {
	        		HashMap<String, String> parameterHashMap = new HashMap<>();
	        		parameterHashMap.put("name", path);
	        		
	        		String example = "";
	        		try {
	        			example = jsonobj2.get("example") + "";
	        		} catch(Exception e) {
	            		System.out.println(e.getMessage());
	            	}
	        		
	        		parameterHashMap.put("example", example);

	        		examplesHashMap.put(path, example);
	        		
	        		String type = "";
	        		try {
	        			type = jsonobj2.getString("type");
	        		} catch(Exception e) {
	            		System.out.println(e.getMessage());
	            	}
	        		parameterHashMap.put("type", type);
	        		parameterHashMap.put("ptype", "property");
	        		parametersList.add(parameterHashMap);
	        		fullPropertiesList.add(parameterHashMap);
	
	               
            	} catch(Exception e) {
            		System.out.println(e.getMessage());
            	}
            }
        	
            for(int i = 0; i < pathsArray.length(); i++) {
            	JSONObject jsonobj = pathsArray.getJSONObject(i);
            	String path = jsonobj.getString("pattern");
            	jsonobj.remove("pattern");
            	if(i == 0) {
                	xmlJSONObj.put("paths", new JSONObject());
            	}
            	JSONObject jsonobj2 = pathsArray.getJSONObject(i).getJSONObject("get");
            	xmlJSONObj.getJSONObject("paths").put(path, new JSONObject());
            	xmlJSONObj.getJSONObject("paths").getJSONObject(path).put("get", jsonobj2);
            	
            	try {
	            	JSONObject parameters = xmlJSONObj.getJSONObject("paths").getJSONObject(path).getJSONObject("get").getJSONObject("parameters");
	            	            	
	            	xmlJSONObj.getJSONObject("paths").getJSONObject(path).getJSONObject("get").put("parameters", new JSONArray());
	            	xmlJSONObj.getJSONObject("paths").getJSONObject(path).getJSONObject("get").getJSONArray("parameters").put(parameters);
            	} catch (JSONException e) {
        			System.out.println(e.getMessage());
            	}
            	
            	JSONArray parametersArray = xmlJSONObj.getJSONObject("paths").getJSONObject(path).getJSONObject("get").getJSONArray("parameters");

                fullParametersList.clear();
            	for (int parameterIterator = 0; parameterIterator < parametersArray.length (); parameterIterator++) {
            	   
            	   parametersList.clear();
            	   
	               	try {
	               		String paramName = parametersArray.getJSONObject(parameterIterator).getString("name");
	   	        		HashMap<String, String> parameterHashMap = new HashMap<>();
	   	        		parameterHashMap.put("name", paramName);
	   	        		
	   	        		String example = "";
	   	        		
	   	        		if(!paramName.contentEquals("limit") && !paramName.contentEquals("offset") && !paramName.contentEquals("visualisation")) {

		   	        		try {
			   	        		example = examplesHashMap.get(paramName);
			   	        		if(example != null) {
				   	        		parameterHashMap.put("example", example);
			   	        		} else {
			   	        			parameterHashMap.put("example", "");
			   	        		}
		   	        		} catch(Exception e) {
		   	            		System.out.println(e.getMessage());
		   	        		}
		   	        		
		   	        		String type = "";
		   	        		try {
		   	        			type = parametersArray.getJSONObject(parameterIterator).getJSONObject("schema").getString("type");
		   	        		} catch(Exception e) {
		   	            		System.out.println(e.getMessage());
		   	            	}
		   	        		parameterHashMap.put("type", type);
		   	        		
		   	        		String in = "";
		   	        		try {
		   	        			in = parametersArray.getJSONObject(parameterIterator).getString("in");
		   	        		} catch(Exception e) {
		   	            		System.out.println(e.getMessage());
		   	            	}
		   	        		parameterHashMap.put("in", in);
		   	        		
		   	        		boolean required = false;
		   	        		try {
		   	        			required = parametersArray.getJSONObject(parameterIterator).getBoolean("required");
		   	        		} catch(Exception e) {
		   	            		System.out.println(e.getMessage());
		   	            		required = false;
		   	            	}
		   	        		parameterHashMap.put("required", String.valueOf(required));
		   	        		
		   	        		parameterHashMap.put("ptype", "parameter");
		   	        		parametersList.add(parameterHashMap);
		   	        		fullParametersList.add(parameterHashMap);

		   	        		if(!path.contentEquals("/")) {
		   	        			xmlJSONObj.getJSONObject("paths").getJSONObject(path).getJSONObject("get").getJSONArray("parameters")
		   	             			.getJSONObject(parameterIterator).put("example", example);
		   	        		}
		   	                
	   	        		}
	   	        		else {
	   	        			int exampleInt = parametersArray.getJSONObject(parameterIterator).getInt("example");
		   	                xmlJSONObj.getJSONObject("paths").getJSONObject(path).getJSONObject("get").getJSONArray("parameters")
		   	             		.getJSONObject(parameterIterator).put("example", exampleInt + "");
	   	        		}
	               	} catch(Exception e) {
	               		System.out.println(e.getMessage());
	               	}

            	}

            	String methodName = "";
            	try{
            		methodName = path.split("/")[1];
            	} catch(Exception e) {
            		methodName = "/";
            	}
        		apiHashMap.put("methodName", methodName);
        		
                fullParametersList.clear();
            	
            	JSONObject jsonobjAux = pathsArray.getJSONObject(i).getJSONObject("get").getJSONObject("responses").getJSONObject("responseCode");
            	xmlJSONObj.getJSONObject("paths").getJSONObject(path).getJSONObject("get").remove("responses");
                xmlJSONObj.getJSONObject("paths").getJSONObject(path).getJSONObject("get").put("responses", new JSONObject());
            	xmlJSONObj.getJSONObject("paths").getJSONObject(path).getJSONObject("get").getJSONObject("responses").put("200", jsonobjAux);
            	
            	if (jsonobjAux.get("content") instanceof JSONArray)
                {
	            	JSONArray jsonobjAuxContentArray = jsonobjAux.getJSONArray("content");
	            	xmlJSONObj.getJSONObject("paths").getJSONObject(path).getJSONObject("get")
            			.getJSONObject("responses").getJSONObject("200").remove("content");
	                xmlJSONObj.getJSONObject("paths").getJSONObject(path).getJSONObject("get")
                		.getJSONObject("responses").getJSONObject("200").put("content", new JSONObject());
	                
	            	for (int j = 0; j < jsonobjAuxContentArray.length(); j++) {
	            		String contentType = jsonobjAuxContentArray.getJSONObject(j).getString("contentTypeName");
		            	JSONObject jsonobjAuxContent = jsonobjAuxContentArray.getJSONObject(j).getJSONObject("contentType");

		            	xmlJSONObj.getJSONObject("paths").getJSONObject(path).getJSONObject("get")
		            		.getJSONObject("responses").getJSONObject("200").getJSONObject("content").put(contentType, jsonobjAuxContent);
		            	
		            	if(contentType.contains("json")) {
			            	String ref = jsonobjAuxContent.getJSONObject("schema").getJSONObject("items").getString("ref");
			            	jsonobjAuxContent.getJSONObject("schema").remove("items");
			            	jsonobjAuxContent.getJSONObject("schema").put("items", new JSONObject());
			            	jsonobjAuxContent.getJSONObject("schema").getJSONObject("items").put("$ref", ref);
		            	}
		            	
	            	}
                } else {
	            	JSONObject jsonobjAuxContentObject = jsonobjAux.getJSONObject("content");
                	String contentType = jsonobjAuxContentObject.getString("contentTypeName");
	            	JSONObject jsonobjAuxContent = jsonobjAuxContentObject.getJSONObject("contentType");
	            	
	            	xmlJSONObj.getJSONObject("paths").getJSONObject(path).getJSONObject("get")
	            		.getJSONObject("responses").getJSONObject("200").remove("content");
	                xmlJSONObj.getJSONObject("paths").getJSONObject(path).getJSONObject("get")
	                	.getJSONObject("responses").getJSONObject("200").put("content", new JSONObject());
	            	xmlJSONObj.getJSONObject("paths").getJSONObject(path).getJSONObject("get")
	            		.getJSONObject("responses").getJSONObject("200").getJSONObject("content").put(contentType, jsonobjAuxContent);
            	
	            	if(contentType.contains("json")) {
		            	String ref = jsonobjAuxContent.getJSONObject("schema").getJSONObject("items").getString("ref");
		            	jsonobjAuxContent.getJSONObject("schema").remove("items");
		            	jsonobjAuxContent.getJSONObject("schema").put("items", new JSONObject());
		            	jsonobjAuxContent.getJSONObject("schema").getJSONObject("items").put("$ref", ref);
	            	}
                }
            	
            }
            
            jsonString = xmlJSONObj.toString();
            ObjectMapper jsonFormatter = new ObjectMapper();
            Object json = jsonFormatter.readValue(jsonString, Object.class);
            jsonStringFormatted = jsonFormatter.writerWithDefaultPrettyPrinter().writeValueAsString(json);
            
            JSONObject xmlSwaggerObj = xmlJSONObj;
            xmlSwaggerObj.remove("openapi");
            xmlSwaggerObj.put("swagger", "2.0");
            String urlServer = xmlSwaggerObj.getJSONArray("servers").getJSONObject(0).getString("url");
            String definitionScheme = ((urlServer.contains("https") ? "https" : "http"));
            urlServer = urlServer.replaceAll("http://", "");
            urlServer = urlServer.replaceAll("https://", "");
            if(StringUtils.countMatches(urlServer,"/") > 0) {
                xmlSwaggerObj.put("host", urlServer.substring(0, urlServer.indexOf("/")));
                xmlSwaggerObj.put("basePath", urlServer.substring(urlServer.indexOf("/")));
            } else {
                xmlSwaggerObj.put("host", urlServer);
                xmlSwaggerObj.put("basePath", "/");
            }
            xmlSwaggerObj.remove("servers");

            
            for(int i = 0; i < xmlSwaggerObj.getJSONObject("paths").length(); i++) {
            	String pathSwagger = xmlSwaggerObj.getJSONObject("paths").names().getString(i);
            	JSONObject jsonobj = xmlSwaggerObj.getJSONObject("paths").getJSONObject(pathSwagger);
            	JSONArray produces = new JSONArray();
            	JSONObject getProduces = xmlSwaggerObj.getJSONObject("paths").getJSONObject(pathSwagger).getJSONObject("get").getJSONObject("responses").getJSONObject("200")
            			.getJSONObject("content");
            	try {
                	if(getProduces.getJSONObject("application/json") != null) {
                		produces.put("application/json");
                	}
            	} catch(JSONException e) {
            		e.printStackTrace();
            	}
            	try {
	            	if(getProduces.getJSONObject("text/html") != null) {
	            		produces.put("text/html");
	            	}
            	} catch(JSONException e) {
            		e.printStackTrace();
            	}
            	
            	jsonobj.getJSONObject("get").put("produces", produces);
            	
            	
            	try {
            		JSONArray parameters = jsonobj.getJSONObject("get").getJSONArray("parameters");
            		for(int j = 0; j < parameters.length(); j++) {
            			parameters.getJSONObject(j).put("type", parameters.getJSONObject(j).getJSONObject("schema").getString("type"));
    	            	parameters.getJSONObject(j).remove("schema");

    	            	try {
	    	            	if(!parameters.getJSONObject(j).getString("example").isEmpty()) {
		            			parameters.getJSONObject(j).put("default", parameters.getJSONObject(j).getString("example"));
		    	            	parameters.getJSONObject(j).remove("example");
	    	            	}
    	            	} catch (JSONException e) {
    	        			System.out.println(e.getMessage());
    	            	}
            		}
	            	
            	} catch (JSONException e) {
        			System.out.println(e.getMessage());
            	}
            	
            	JSONObject contentObject = jsonobj.getJSONObject("get").getJSONObject("responses").getJSONObject("200").getJSONObject("content");
            	
            	try {
	            	if(contentObject.getJSONObject("application/json") != null) {
	            		JSONObject jsonobjAuxSwagger = contentObject.getJSONObject("application/json").getJSONObject("schema");
	                	jsonobj.getJSONObject("get").getJSONObject("responses").getJSONObject("200").remove("content");
	                	jsonobj.getJSONObject("get").getJSONObject("responses").getJSONObject("200").put("schema", jsonobjAuxSwagger);
	                	
	                	String ref = jsonobj.getJSONObject("get").getJSONObject("responses").getJSONObject("200").getJSONObject("schema").getJSONObject("items").getString("$ref");
	                	jsonobj.getJSONObject("get").getJSONObject("responses").getJSONObject("200").getJSONObject("schema").getJSONObject("items").remove("$ref");
	                	jsonobj.getJSONObject("get").getJSONObject("responses").getJSONObject("200").getJSONObject("schema").getJSONObject("items").put("$ref", "#/definitions" + ref.substring(ref.lastIndexOf("/")));
	            	}
            	} catch(JSONException e) {
            		e.printStackTrace();
            	}

            	try {
                	if(contentObject.getJSONObject("text/html") != null) {
                		JSONObject jsonobjAuxSwagger = contentObject.getJSONObject("text/html").getJSONObject("schema");
                    	jsonobj.getJSONObject("get").getJSONObject("responses").getJSONObject("200").remove("content");
                    	jsonobj.getJSONObject("get").getJSONObject("responses").getJSONObject("200").put("schema", jsonobjAuxSwagger);	
                    }
            	} catch(JSONException e) {
            		e.printStackTrace();
            	}
            	
            }
            
            JSONObject componentsSchemas = xmlSwaggerObj.getJSONObject("components").getJSONObject("schemas");
            xmlSwaggerObj.remove("components");
            xmlSwaggerObj.put("definitions", componentsSchemas);
            JSONArray definitionsSchemes = new JSONArray();
            definitionsSchemes.put(definitionScheme);
            xmlSwaggerObj.put("schemes", definitionsSchemes);
            
            swaggerString = xmlSwaggerObj.toString();
            ObjectMapper swaggerFormatter = new ObjectMapper();
            Object jsonSwagger = swaggerFormatter.readValue(swaggerString, Object.class);
            swaggerStringFormatted = swaggerFormatter.writerWithDefaultPrettyPrinter().writeValueAsString(jsonSwagger);
            
        } catch (JSONException e) {
			System.out.println(e.getMessage());
			e.printStackTrace();
        } catch (JsonParseException e) {
			System.out.println(e.getMessage());
		} catch (JsonMappingException e) {
			System.out.println(e.getMessage());
		} catch (IOException e) {
			System.out.println(e.getMessage());
		}
		
		try (PrintWriter out = new PrintWriter(mainFolderName + File.separator + tempFolderName + File.separator + openAPIFileName)) {
		    out.println(jsonStringFormatted);
		} catch (FileNotFoundException e) {
			System.out.println(e.getMessage());
		}
		
		try (PrintWriter out = new PrintWriter(mainFolderName + File.separator + tempFolderName + File.separator + swaggerFileName)) {
		    out.println(swaggerStringFormatted);
		} catch (FileNotFoundException e) {
			System.out.println(e.getMessage());
		}
	}

	private static void generateServer() {

		// TODO: Swagger 2.0 to OpenAPI
		
		String sourcePath = mainFolderName + File.separator + tempFolderName + File.separator + swaggerFileName;
		new File(mainFolderName + File.separator + apiCodeFolderName).mkdirs();
		File source = new File(sourcePath);
		File dest = new File(mainFolderName + File.separator + apiCodeFolderName + File.separator + swaggerFileName);
		try {
		    FileUtils.copyFile(source, dest);
		} catch (IOException e) {
		    e.printStackTrace();
		}

		String sourcePath2 = mainFolderName + File.separator + tempFolderName + File.separator + openAPIFileName;
		File source2 = new File(sourcePath2);
		File dest2 = new File(mainFolderName + File.separator + apiCodeFolderName + File.separator + openAPIFileName);
		try {
		    FileUtils.copyFile(source2, dest2);
		} catch (IOException e) {
		    e.printStackTrace();
		}
		
		String[] args = new String [7];
		args[0] = "generate";
		args[1] = "--lang";
		args[2] = "nodejs-server";
		args[3] = "--input-spec";
		args[4] = mainFolderName + File.separator + apiCodeFolderName + File.separator + swaggerFileName;
		args[5] = "--output";
		args[6] = mainFolderName + File.separator + apiCodeFolderName;
		SwaggerCodegen.main(args);
	}

	private static void addServerDependencies() {
        String lines = "";
        BufferedReader br = null;
		try {
			br = new BufferedReader(new FileReader(mainFolderName + File.separator + apiCodeFolderName + "/package.json"));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        String line = "";
        try {
			while ((line = br.readLine()) != null) {
				lines += line + "\n";
				if(line.contains("\"dependencies\": {")) {
					lines += "\t" + "\"papaparse\": \"^4.3.7\"," + "\n";
				} 
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NullPointerException e) {
			e.printStackTrace();
		}
        try {
			br.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}catch (NullPointerException e) {
			e.printStackTrace();
		}
        PrintWriter writer = null;
		try {
			writer = new PrintWriter(mainFolderName + File.separator + apiCodeFolderName + "/package.json", "UTF-8");
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        writer.println(lines);
        writer.close();
		
	}

	private static void generateApiCode() {
		// Edit DefaultService.js of nodejs server
		String servercode = "";
		
		BufferedReader br = null;
		String line = "";
        ArrayList<String> lineFunctionNames = new ArrayList<String>();
		try {
			br = new BufferedReader(new FileReader(mainFolderName + File.separator + apiCodeFolderName + "/controllers/DefaultService.js"));
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        try {
			while ((line = br.readLine()) != null) {
				if(line.contains("function(args, res, next) {")) {
					lineFunctionNames.add(line + "\n");
				}
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}catch (NullPointerException e) {
			e.printStackTrace();
		}
        try {
			br.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}catch (NullPointerException e) {
			e.printStackTrace();
		}
        
        BufferedReader brServer = null;
        String lineServer = "";
		try {
			brServer = new BufferedReader(new InputStreamReader
					(AWAG4Maps.class.getResourceAsStream(fileSeparatorForResources + resFolderName 
							+ fileSeparatorForResources + apiFolderName 
							+ fileSeparatorForResources + serverCodeFileName)));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        try {
			while ((lineServer = brServer.readLine()) != null) {
				if(lineServer.contains("var fileName =")) {
					//servercode += "\tvar fileName =\"./" + fileName + "." + fileType + "\";" + "\n";
					servercode += lineServer + "\n";
				} 
				else {
					servercode += lineServer + "\n";
				}
			}
			for(String lineFunctionName: lineFunctionNames) {
				if(lineFunctionName.contains("getvisualisation")) {
					servercode += lineFunctionName + "\t" + "var obj = new Object();obj.value = \"visualisation\";args.visualisation = obj;\n"
							+ "\t" + "exports.getOperation(args, res, next); \n}\n";
				} else {
					servercode += lineFunctionName + "\t" + "exports.getOperation(args, res, next); \n}\n";
				}
			}
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NullPointerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
        try {
        	brServer.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NullPointerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		
        
        PrintWriter writer = null;
		try {
			writer = new PrintWriter(mainFolderName + File.separator + apiCodeFolderName + "/controllers/DefaultService.js", "UTF-8");
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			writer.println(servercode);
			writer.close();
		} catch (NullPointerException e) {
			e.printStackTrace();
		}		
	}

	private static void generateVisualisation() {
	
		
		// ChartJS
		
		//Determine the columns to generate the graph
		JSONObject xmlJSONObj;
		ArrayList<String> columnNames = new ArrayList<String>();
		ArrayList<String> allColumnNames = new ArrayList<String>();
		String columnNameId = "";
		try {
			xmlJSONObj = XML.toJSONObject(FileUtils.readFileToString(new File(mainFolderName + File.separator + tempFolderName + File.separator + openAPIXMIFileName)));
			JSONArray xmlJSONObjAux = xmlJSONObj.getJSONObject("openapi:API").getJSONObject("components")
					.getJSONObject("schemas").getJSONObject("mainComponent").getJSONArray("properties");
			
			for(int i = 0; i < xmlJSONObjAux.length(); i++) {
				if(i == 0) {
					columnNameId = xmlJSONObjAux.getJSONObject(i).get("name").toString();
				}
				else if(xmlJSONObjAux.getJSONObject(i).getJSONObject("content").get("type").equals("integer")) {
					columnNames.add(xmlJSONObjAux.getJSONObject(i).get("name").toString());
				}
				allColumnNames.add(xmlJSONObjAux.getJSONObject(i).get("name").toString());
			}
		} catch (JSONException | IOException e1) {
			// TODO Auto-generated catch block
			e1.printStackTrace();
		}
		
		String visualisationCode = "";
		BufferedReader brVisualisation = null;
	    String lineVisualisation = "";
		try {
			brVisualisation = new BufferedReader(new InputStreamReader
					(AWAG4Maps.class.getResourceAsStream(fileSeparatorForResources + resFolderName 
		            		+ fileSeparatorForResources + "visualisation" 
		            		+ fileSeparatorForResources + visualisationChartJS)));
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    try {
			while ((lineVisualisation = brVisualisation.readLine()) != null) {
				//TODO: arreglar pie chart (con botones como en Charts de iOS)
				if(lineVisualisation.contains("datasetsLineChart") || lineVisualisation.contains("datasetsBarChart")) {
					
					String datasets = "";
					
					if(lineVisualisation.contains("datasetsLineChart")) {
						for(int i = 0; i < columnNames.size(); i ++) {
							if (i > 0) {
								datasets += ",";
							}
							String dataset = "{\n" + 
									"	label: '"+ columnNames.get(i) + "',\n" + 
									"	backgroundColor: color(colorsArray[" + i + "% colorsArray.length]).alpha(0.5).rgbString(),\n" + 
									"	borderColor: colorsArray[" + i + "% colorsArray.length],\n" + 
									"	borderWidth: 3,\n" + 
									"	fill: false,\n" + 
									"	data: [\n" + 
									"		dataLineChart" + //columnNames.get(i) +
									"	]\n" + 
									"}";
							datasets += dataset;
						}
						
						visualisationCode += lineVisualisation.replace("datasetsLineChart", datasets) + "\n";
					}
					else if(lineVisualisation.contains("datasetsBarChart")) {
						for(int i = 0; i < columnNames.size(); i ++) {
							if (i > 0) {
								datasets += ",";
							}
							String dataset = "{\n" + 
									"	label: '"+ columnNames.get(i) + "',\n" + 
									"	backgroundColor: color(colorsArray[" + i + "% colorsArray.length]).alpha(0.5).rgbString(),\n" + 
									"	borderColor: colorsArray[" + i + "% colorsArray.length],\n" + 
									"	borderWidth: 3,\n" + 
									"	data: [\n" + 
									"		dataBarChart" + //columnNames.get(i) +
									"	]\n" + 
									"}";
							datasets += dataset;
						}
						
						visualisationCode += lineVisualisation.replace("datasetsBarChart", datasets) + "\n";
					}
				} 
				else if(lineVisualisation.contains("configPie0")) {
					String pies = "";
					for(int i = 0; i < allColumnNames.size(); i ++) {
						String pie = "var configPie" + i + " = {\n" + 
						"			type: 'pie',\n" + 
						"			data: {\n" + 
						"				datasets: [{\n" + 
						"					data: [ " +
						"						dataPieChart\n" + 
						"					],\n" + 
						"					backgroundColor: [\n" + 
						"						window.chartColors.red,\n" + 
						"						window.chartColors.orange,\n" + 
						"						window.chartColors.yellow,\n" + 
						"						window.chartColors.green,\n" + 
						"						window.chartColors.blue,\n" + 
						"					],\n" + 
						"					label: '" + allColumnNames.get(i) + "'\n" + 
						"				}"+
						"				],\n" + 
						"				labels: [\n" + 
						"					labelsPieChart\n" + 
						"				]\n" + 
						"			},\n" + 
						"			options: {\n" + 
						"				responsive: true,\n" + 
						"				title: {\n" + 
						"					display: true,\n" + 
						"					text: 'Chart.js Pie Chart (" + allColumnNames.get(i) + ")'\n" + 
						"				}" +
						"			}\n" + 
						"		};\n\n";
						pie += "</script>\n\n<button id=\"pieChartButton" + i + "\">PieChart " + allColumnNames.get(i) + "</button>\n\n<script>\n\n";
						pie += "		document.getElementById('pieChartButton" + i + "').addEventListener('click', function() {\n" + 
								"			var pie = document.getElementById('chart-area').getContext('2d');\n" + 
								"			window.myPie = new Chart(pie, configPie" + i + ");\n" + 
								//"			document.getElementById('pieChartLabel').innerHTML = '" + allColumnNames.get(i) + "';\n" +
								"		});\n\n";
						pies += pie;
					}
					visualisationCode += lineVisualisation.replace("var configPie0;", pies) + "\n";
				}
				else {
					visualisationCode += lineVisualisation + "\n";
				}
			}
			System.out.println("Visualisation.html generated");
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NullPointerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    try {
	    	brVisualisation.close();
		} catch (IOException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (NullPointerException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	    
	    PrintWriter writer = null;
		try {
			writer = new PrintWriter(mainFolderName + File.separator + apiCodeFolderName + File.separator + 
					"controllers" + File.separator + visualisationChartJS, "UTF-8");
		} catch (FileNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		} catch (UnsupportedEncodingException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		try {
			writer.println(visualisationCode);
			writer.close();
		} catch (NullPointerException e) {
			e.printStackTrace();
		}
		System.out.println("Visualisation.html saved");
	}

	private static void runApi() {

		System.out.println("Launching API to localhost...");
		try {
            Files.copy(AWAG4Maps.class.getResourceAsStream(fileSeparatorForResources + resFolderName 
            		+ fileSeparatorForResources + "api" + fileSeparatorForResources + "runApi.bat"), 
            		new File(mainFolderName + File.separator + "runApi.bat").toPath(), StandardCopyOption.REPLACE_EXISTING);
            Files.copy(AWAG4Maps.class.getResourceAsStream(fileSeparatorForResources + resFolderName + 
            		fileSeparatorForResources + "api" + fileSeparatorForResources + "runApi2.bat"), 
            		new File(mainFolderName + File.separator + "runApi2.bat").toPath(), StandardCopyOption.REPLACE_EXISTING);
        } catch (IOException e) {
			System.out.println(e.getMessage());
        }
		File execFile = new File(mainFolderName + File.separator + "runApi.bat");
		execFile.setExecutable(true);
		
	    try {
	    	String executable = "./" + mainFolderName + File.separator + "runApi.bat";
	    	if(System.getProperty("os.name", "generic").toLowerCase(Locale.ENGLISH).indexOf("win") >= 0) {
	    		executable = mainFolderName + File.separator + "runApi.bat";
	    		Runtime.getRuntime().exec("cmd.exe /C start " + executable);
	    	}
	    	else {
	    		Process p = new ProcessBuilder(executable, "").start();
	    	}
	    } catch (IOException e) {
	        // TODO Auto-generated catch block
	        e.printStackTrace();
	    }

		System.out.println("Server listening in http://localhost:8080/v1/");
		
	}
	
}