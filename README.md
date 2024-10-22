# Data Transformations

This document delineates the transformations that data undergoes through the implementation of various functions within a system designed to facilitate the conversion of data models and the generation of API code.
These transformations are conducted within a workflow that encompasses model manipulation, code generation, and data structure adaptation.

## Functions and their Transformations
- `convertCSVIntoXMI()` This function converts structured data in a CSV file to an XMI format, ensuring that the hierarchy and relationships of the data are maintained during the transformation.

  *Transformations*

  The conversion process entails the transformation of each row within the CSV file into a set of elements within the XMI file. This is achieved while maintaining the requisite relationships and hierarchy.

- `addPropertiesToATL()` This function serves to augment the data in an ATL (Atlas Transformation Language) transformation file with information pertaining to its intrinsic properties.

  *Transformations*
  
  An ATL template file is copied and serves as the foundation for the data transformation.
  The data rows are read and, in the event that specific columns are identified, a placeholder within the ATL file is replaced with the corresponding data properties (such as ID, latitude, longitude, and so forth).
  New lines are generated in the ATL file, incorporating the values of the aforementioned properties.

- `table2mapModelTransformation()` This function facilitates a model-to-model transformation, whereby data from a table is converted to a map.

  *Transformations*
  
  The requisite metamodels and transformation files (ATL) are then copied.
  The transformation process is executed using the table and map models, whereby the data structures of the source model (table) are adapted to align with those of the target model (map).

- `model2modelTransformation()` This function is analogous to the previous one, but its objective is the transformation of table models into OpenAPI.

  *Transformations*
  
  The requisite metamodels and specific transformation files are then copied.
  The transformation of the table model data to the OpenAPI model is performed, resulting in the generation of a new model that will be employed for API generation purposes.

- `convertXMIintoJSON()` This function facilitates the conversion of an API definition file in XMI format into two distinct formats. The resulting output can be expressed in either JSON or Swagger (OpenAPI 2.0) format. The system is able of carrying out comprehensive and sophisticated transformations of data sets, encompassing the processes of reading, cleansing, organisation and outputting data in designated formats.

  *Transformations*

  The XMI structure is transformed into a JSON object, whereby the relevant data is cleaned and organised.
  The formatting for Swagger is as follows: The JSON format is modified to align with the Swagger 2.0 specifications, thereby enabling its utilisation by tools that generate API documentation.
  The process of extracting properties and parameters is as follows: The properties and parameters are collated in order to provide an accurate and comprehensive documentation of the API, including illustrative examples and detailed information on the required or optional nature of each parameter.

- `generateServer()` This function is responsible for the preparation and generation of the API server in accordance with the OpenAPI specification.

  *Transformations*
  
  The Swagger and OpenAPI configuration files are copied from a temporary folder to an API code folder.
  The server code is generated in Node.js using Swagger Codegen, utilising the aforementioned copied specifications.

- `addServerDependencies()` This function is responsible for the addition of requisite dependencies to the package.json file of the API server.

  *Transformations*
  
  The existing package.json file is then read and the dependencies section is located.
  The papaparse dependency is added to facilitate manipulation of Comma-Separated Values (CSV), thereby ensuring that the server has the requisite libraries to function.

- `generateApiCode()` The function modifies the application programming interface (API) server service code to include new functions that handle operations.

  *Transformations*
  
  The DefaultService.js file is read and the existing functions are extracted.
  The functions are modified to include additional logic that handles data, such as the assignment of values and the transmission of operational responses.
  A new DefaultService.js file is generated, which includes the newly adapted logic.

- `generateWebAugmenter()` This function contains the main transformations that will be applied to the web augmenter template for the generation of the new code. The objective of this design is to enable the customisation of the file in accordance with the inputs provided, thereby facilitating the dynamic generation of JavaScript content.

  *Transformations*

  The modifications made to the template code for the generation of a final customised file are contingent upon the values of the arguments received and the names of the columns to be worked with in the web augmenter, which are obtained from the first row.
