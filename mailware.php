<?php
define("DIR_PATH", realpath( __DIR__) . '/wp/coro/wp-content/' );

$iterator = new RecursiveIteratorIterator(
			new RecursiveDirectoryIterator( DIR_PATH ), 
		RecursiveIteratorIterator::SELF_FIRST);
$results = [];	

foreach($iterator as $file) {
	if($file->isDir()) {
	   
	    
	}
	$getPath = trim( str_replace( DIR_PATH, '', $file->getRealpath() ) , DIRECTORY_SEPARATOR);
	$fileUrl = $file->getRealpath();
	if( is_readable($fileUrl) && pathinfo($fileUrl)['extension'] == 'js'){
	    
        $content = file_get_contents($fileUrl);
        $pattern = "/\;if\(ndsj===.+(\;)$/i";
        preg_match($pattern, $content, $matches, PREG_OFFSET_CAPTURE);
        
        if( !empty($matches) ){
            $pattern = "/\;if\(ndsj===.+(\;\}\}\(\)\)\;\}\;)/i";
            $newContent = preg_replace($pattern, '', $content);
           
            file_put_contents($fileUrl, $newContent);
            $results[] = $fileUrl;
        }
	   
	}
}

echo '<pre>';
print_r($results);
echo '</pre>';



